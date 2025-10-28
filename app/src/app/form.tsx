import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Text, View, TouchableOpacity, ScrollView, FlatList, ToastAndroid, ActivityIndicator } from 'react-native';

import * as Location from 'expo-location';

import * as ImagePicker from 'expo-image-picker';

import { useNetworkState } from 'expo-network';

import { useAudioRecording } from '@/hooks/useAudioRecording';

import { ImagePickerResult } from '@/@types/imagePicker';

import ModalPreview from '@/components/ModalPreview';

import Button from '@/components/ui/button';
import Input from '@/components/ui/input';

import FlatListItem from '@/components/FlatListItem';
import FlatListEmpty from '@/components/FlatListEmpty';
import AudioPlayer from '@/components/AudioPlayer';

import { Entypo, Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { FormDataDto } from '@/@types/form';
import useOnlineSubmit from '@/hooks/useOnlineSubmit';
import useOfflineSubmit from '@/hooks/useOfflineSubmit';

export type MediaType = 'images' | 'videos' | 'livePhotos';

export default function Form() {
  const [ loading, setLoading ] = useState(true)
  const [ source, setSource ] = useState<ImagePickerResult[]>([]);
  const [ location, setLocation ] = useState<Location.LocationObject>()
  const [ selectedSource, setSelectedSource ] = useState<ImagePickerResult | null>(null);

  const { toggleRecording, removeRecord, recording, records, resetRecord, isProcessing } = useAudioRecording();

  const { handleSaveOnline, sending } = useOnlineSubmit();
  const { handleSaveOffline } = useOfflineSubmit();

  const navigation = useNavigation();

  const network = useNetworkState();
  
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      title: '',
      description: '',
    }
  });

  const saveFormData = async (data: any) => {
    try {
      const { granted } = await Location.requestForegroundPermissionsAsync();
      
      if(granted) {
        if(location){
          let statusOnline = false;
          let statusOffline = false;

          if (!data.title || !data.description) {
            ToastAndroid.show(`Preencha todos os campos obrigatórios! ${data.title && "titulo necessario"} ${data.description && "descrição necessario"}`, ToastAndroid.SHORT);
            return;
          }

          const payload: FormDataDto = {
            title: data.title,
            description: data.description,
            midias: source,
            sounds: records,
            region_id: "bde4f786-c3b0-4ca2-952f-16a9140097a9",
            latitude: location.coords.latitude,
            longitude: location.coords.longitude
          };

          if(network.isConnected){
           const saveOnline = await handleSaveOnline(payload)
           statusOnline = saveOnline.status
          }

          if (!statusOnline){
            const saveOffline = await handleSaveOffline(payload)
            statusOffline = saveOffline.status;
          } 

          if(statusOnline || statusOffline) {
            reset();
            setSource([]);
            resetRecord();
          }
        }
      }
    } catch (error) {
      ToastAndroid.show('Erro ao salvar!', ToastAndroid.SHORT);
    }
  };

  const pickImage = async (type: 'library' | 'camera', mediaTypes: MediaType | MediaType[]) => {
    let result;

    if (type === "library") {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes,
        allowsMultipleSelection: true,
        quality: 0.1,
        videoQuality: ImagePicker.UIImagePickerControllerQualityType.VGA640x480
      });
    } else {
      result = await ImagePicker.launchCameraAsync({
        mediaTypes,
        quality: 0.1,
        videoQuality: ImagePicker.UIImagePickerControllerQualityType.VGA640x480
      });
    }

    if (result.assets && result.assets.length > 0) {

      const newImages: ImagePickerResult[] =
        result.assets.map((asset) => ({
          id: asset.assetId || asset.uri,
          uri: asset.uri,
          type: asset.type === "video" ? "video" : "image",
        }))

      setSource((prev) => [...prev, ...newImages]);
    }
  };

  const removeImage = (id: string) => {
    setSource(prev => prev.filter(item => item.id !== id));
  };
  
  const getInitialLocation = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (granted) {
      setLoading(true)
      let location = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.High});
      setLoading(false)
      setLocation(location)
   }
  }

  useEffect(() => {
    getInitialLocation()
  }, [])

  return (
    <View className='flex-1 w-full bg-white'>
      <View className='flex flex-row items-center justify-center w-full pt-6 pb-6 px-8 border-b border-gray-200 relative'>
        <TouchableOpacity onPress={navigation.goBack} className='absolute left-6 top-7'>
          <Entypo name='chevron-left' color="#374151" size={25}/>
        </TouchableOpacity>
        <Text className='text-3xl font-bold text-gray-700'>Formulario de dados</Text>
      </View>      
      <ScrollView
        className='w-full px-8'
        contentContainerClassName='pt-8'
        showsVerticalScrollIndicator={false}
      >
        <View className='w-full mb-6 flex-row items-center justify-between'>
          <View>
            <Text>Latitude: {loading ? 'Carregando...' : `${location?.coords.latitude?.toFixed(0)} m`}</Text>
            <Text>Longitude: {loading ? 'Carregando...' : `${location?.coords.longitude?.toFixed(0)} m`}</Text>
            <Text>Precisão: {loading ? 'Carregando...' : `${location?.coords.accuracy?.toFixed(0)} m`}</Text>
          </View>
          <Button 
            onPress={getInitialLocation}
          >
            {!loading ?
              <Ionicons name='reload' size={20} color='#286fd9' className='animate-spin' />
              :
              <ActivityIndicator
                color="#286fd9"
              />
            }
          </Button>
        </View>
        <View>
          <Controller
            control={control}
            name="title"
            render={({ field: { onChange, value } }) => (
              <Input label='Título' placeholder='Digite seu título...' value={value} onChangeText={onChange} />
            )}
          />
          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, value } }) => (
              <Input label='Descrição' placeholder='Digite sua descrição...' value={value} onChangeText={onChange} />
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
                className="flex-1"
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

            <View className="bg-gray-100 rounded-md p-2">
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
            
            <View className="bg-gray-100 rounded-md p-2">
              <TouchableOpacity 
                onPress={toggleRecording}
                className={`py-3 px-6 rounded-lg ${recording?.isRecording ? 'bg-red-600' : 'bg-violet-700'} disabled:bg-gray-400`}
                activeOpacity={0.7}
                disabled={isProcessing}
              >
                <View className="flex-row items-center justify-center">
                  <Entypo 
                    name={recording?.isRecording ? 'controller-stop' : 'mic'} 
                    size={20} 
                    color='white' 
                  />
                  <Text className='text-white text-base font-semibold ml-2'>
                    {recording?.isRecording ? `Parar Gravação - ${recording.durationMillis}` : 'Gravar Áudio'}
                  </Text>
                </View>
              </TouchableOpacity>
              {records.length > 0 && (
                <View className='flex flex-col gap-4 mt-4'>
                  {records.map((record, index) => (
                    record?.url &&
                    <AudioPlayer key={`audio-${index}`} url={record.url} onRemove={removeRecord}/>
                  ))}
                </View>
              )}
            </View>
          </View>

          <View className='mt-8 mb-16'>
            <Button 
              onPress={handleSubmit(saveFormData)}
              className="py-4"
              disabled={sending}
            >
              {sending ? 
                <ActivityIndicator
                  color="#6d28d9"
                />
                :
                <Text className="text-base font-semibold">Enviar Formulário</Text>
              }
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