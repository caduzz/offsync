import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Text, View, TouchableOpacity, ScrollView, FlatList, ToastAndroid } from 'react-native';

import * as Location from 'expo-location';

import * as ImagePicker from 'expo-image-picker';
import { useNetworkState } from 'expo-network';

import { useAudioRecording } from '@/hooks/useAudioRecording';
import { useAsyncStorage } from '@/hooks/useAsyncStorage';

import { ImagePickerResult } from '@/@types/imagePicker.r';

import ModalPreview from '@/components/ModalPreview';

import Button from '@/components/ui/button';
import Input from '@/components/ui/input';

import FlatListItem from '@/components/FlatListItem';
import FlatListEmpty from '@/components/FlatListEmpty';
import AudioPlayer from '@/components/AudioPlayer';

import { Entypo } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';

export type MediaType = 'images' | 'videos' | 'livePhotos';

export default function Form() {
  const [source, setSource] = useState<ImagePickerResult[]>([]);
  const [selectedSource, setSelectedSource] = useState<ImagePickerResult | null>(null);
  const { toggleRecording, removeRecord, recording, records, resetRecord, setRecords } = useAudioRecording();
  const { setAsyncStorage, getAsyncStorage } = useAsyncStorage();
  const net = useNetworkState();
  const [location, setLocation] = useState<Location.LocationObject>()
  
  const navigation = useNavigation()
  
  const { control, handleSubmit, reset, watch } = useForm({
    defaultValues: {
      nome: '',
      email: '',
      telefone: '',
      senha: '',
    }
  });

  const formData = watch();
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const preSaveFormData = async () => {
    try {
      const preSaveData = {
        ...formData,
        midias: source,
        audios: records,
        timestamp: new Date().toISOString()
      };

      setAsyncStorage('@offsync/pre-save-form', preSaveData);
    } catch (error) {
      console.log('Erro ao fazer pré-salvamento:', error);
    }
  };

  const loadPreSavedData = async () => {
    try {
      const preSavedData = await getAsyncStorage('@offsync/pre-save-form');
      if (preSavedData) {
        reset({
          nome: preSavedData.nome || '',
          email: preSavedData.email || '',
          telefone: preSavedData.telefone || '',
          senha: preSavedData.senha || '',
        });
        
        if (preSavedData.midias) {
          setSource(preSavedData.midias);
        }
        if (preSavedData.audios) {
          setRecords(preSavedData.audios);
        }
      }
    } catch (error) {
      console.log('Erro ao carregar dados pré-salvos:', error);
    } finally {
      setIsInitialLoad(false);
    }
  };

  const clearPreSavedData = async () => {
    try {
      setAsyncStorage('@offsync/pre-save-form', null);
    } catch (error) {
      console.log('Erro ao limpar dados pré-salvos:', error);
    }
  };

  const saveFormData = async (data: any) => {
    try {
      const { granted } = await Location.requestForegroundPermissionsAsync();
      
      if(granted) {
        if(location){
          if (!data.nome || !data.email || !data.telefone || !data.senha) {
            console.log("erro")
            ToastAndroid.show('Preencha todos os campos obrigatórios!', ToastAndroid.SHORT);
            return;
          }

          const formDataFile = await getAsyncStorage('formData')
          const formData = {
            ...data,
            midias: source,
            audios: records,
            location: location.coords,
            timestamp: location.timestamp
          };

          setAsyncStorage('formData', formDataFile ? [...formDataFile, formData] : [formData]);
          ToastAndroid.show('Formulário salvo!', ToastAndroid.SHORT);

          await clearPreSavedData();
          
          reset();
          setSource([]);
          resetRecord();
        }
      }
    } catch (error) {
      ToastAndroid.show('Erro ao salvar!', ToastAndroid.SHORT);
    }
  };

  const pickImage = async (type: 'library' | 'camera', mediaTypes: MediaType | MediaType[]) => {
    let result;
    if (type === 'library') {
      result = await ImagePicker.launchImageLibraryAsync({ 
        mediaTypes: ['images', 'videos'], 
        allowsMultipleSelection: true 
      });
    } else {
      result = await ImagePicker.launchCameraAsync({ mediaTypes });
    }
    if (result.assets && result.assets[0].uri) {
      const newImage: ImagePickerResult[] = result.assets.map(asset => ({
        id: asset.assetId || asset.uri,
        uri: asset.uri,
        type: asset.type === 'video' ? 'video' : 'image',
      }));
      
      setSource(prev => [...prev, ...newImage]);
    }
  };

  const removeImage = (id: string) => {
    setSource(prev => prev.filter(item => item.id !== id));
  };
  
  const getInitialLocation = async () => {
    let location = await Location.getCurrentPositionAsync({accuracy: 6});
    setLocation(location)
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', () => {
      if (isInitialLoad) return;
      preSaveFormData();
    });

    return unsubscribe;
  }, [navigation, formData, records, source, isInitialLoad]);

  useEffect(() => {
    getInitialLocation()
  }, [])

  useEffect(() => {
    loadPreSavedData();
  }, []);

  return (
    <View className='flex-1 w-full bg-white'>
      <View className='flex flex-row items-center justify-between w-full mb-4 pt-16 pb-6 px-8 border-b border-gray-200'>
        <TouchableOpacity onPress={navigation.goBack}>
          <Entypo name='chevron-left' color="#374151" size={25}/>
        </TouchableOpacity>
        <Text className='text-3xl font-bold text-gray-700'>Formulario de dados</Text>
      </View>      
      <ScrollView
        className='w-full px-8'
        contentContainerClassName='pt-8'
        showsVerticalScrollIndicator={false}
      >
        <Text>{location?.coords.accuracy}</Text>
        <Button onPress={getInitialLocation}>Reload</Button>
        <View>
          <Controller
            control={control}
            name="nome"
            render={({ field: { onChange, value } }) => (
              <Input label='Nome' placeholder='Digite seu nome...' value={value} onChangeText={onChange} />
            )}
          />
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <Input label='Email' placeholder='Digite seu email...' value={value} onChangeText={onChange} />
            )}
          />
          <Controller
            control={control}
            name="telefone"
            render={({ field: { onChange, value } }) => (
              <Input label='Telefone' placeholder='Digite seu telefone...' value={value} onChangeText={onChange} />
            )}
          />
          <Controller
            control={control}
            name="senha"
            render={({ field: { onChange, value } }) => (
              <Input label='Senha' placeholder='Digite sua senha...' secureTextEntry value={value} onChangeText={onChange} />
            )}
          />

          <View className='mt-2'>
            <View className="flex-row items-center justify-between">
              <Text className="text-lg font-semibold text-gray-700">
                Galeria de Mídia
              </Text>
              {source.length > 0 && (
                <View className="bg-violet-100 px-3 py-1 rounded-full">
                  <Text className="text-violet-700 text-sm font-medium">
                    {source.length} {source.length === 1 ? 'item' : 'itens'}
                  </Text>
                </View>
              )}
            </View>

            <View className='flex-row justify-between mb-4 gap-2'>
              <Button
                onPress={() => pickImage('library', ['images', 'videos'])}
                className="flex-1 mr-2"
              >
                <View className="flex-row items-center gap-2">
                  <Entypo name='images' size={18} color='gray' />
                  <Text className="text-sm font-medium">Galeria</Text>
                </View>
              </Button>
              
              <Button
                onPress={() => pickImage('camera', 'images')}
                className="flex-1"
              >
                <View className="flex-row items-center gap-2">
                  <Entypo name='camera' size={18} color='gray' />
                  <Text className="ml-2 text-sm font-medium">Foto</Text>
                </View>
              </Button>
              
              <Button 
                onPress={() => pickImage('camera', 'videos')}
                className="flex-1"
              >
                <View className="flex-row items-center gap-2">
                  <Entypo name='video' size={18} color='gray' />
                  <Text className="text-sm font-medium">Vídeo</Text>
                </View>
              </Button>
            </View>

            <View className="bg-gray-50 rounded-xl p-2">
              <FlatList
                data={source}
                renderItem={({ item }) => (
                  <FlatListItem
                    item={item}
                    onPress={() => setSelectedSource(item)}
                    onRemove={() => removeImage(item.id)}
                  />
                )}
                keyExtractor={(item) => item.uri}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  paddingVertical: 4,
                  paddingHorizontal: 4,
                  gap: 10
                }}
                ListEmptyComponent={<FlatListEmpty />}
              />
            </View>
          </View>

          <View className='mt-6'>
            <Text className="text-lg font-semibold text-gray-700 mb-4">
              Gravação de Áudio
            </Text>
            
            <View className="bg-gray-50 rounded-xl p-4">
              <TouchableOpacity 
                onPress={toggleRecording}
                className={`py-3 px-6 rounded-lg ${recording?.isRecording ? 'bg-red-600' : 'bg-violet-700'}`}
                activeOpacity={0.7}
              >
                <View className="flex-row items-center justify-center">
                  <Entypo 
                    name={recording?.isRecording ? 'controller-stop' : 'mic'} 
                    size={20} 
                    color='white' 
                  />
                  <Text className='text-white text-base font-semibold ml-2'>
                    {recording?.isRecording ? 'Parar Gravação' : 'Gravar Áudio'}
                  </Text>
                </View>
              </TouchableOpacity>
              {records.length > 0 && (
                <View className='flex flex-col gap-4 mt-4'>
                  {records.map(record => (
                    record?.url &&
                    <AudioPlayer key={record.url} url={record.url} onRemove={removeRecord}/>
                  ))}
                </View>
              )}
            </View>
          </View>

          <View className='mt-8 mb-16'>
            <Button 
              onPress={handleSubmit(saveFormData)}
              className="py-4"
            >
              <Text className="text-base font-semibold">Enviar Formulário</Text>
            </Button>
          </View>
        </View>
        
        <ModalPreview
          visible={!!selectedSource}
          onClose={() => setSelectedSource(null)}
          source={selectedSource}
        />
      </ScrollView>
    </View>
  );
}