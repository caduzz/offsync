import React, { useCallback } from 'react';
import { useEffect, useState } from 'react';
import { Text, FlatList, View, ScrollView, TouchableOpacity } from 'react-native';

import { navigate } from 'expo-router/build/global-state/routing';

import { useAsyncStorage } from '@/hooks/useAsyncStorage';

import AudioPlayer from '@/components/AudioPlayer';
import Button from '@/components/ui/button';
import FlatListItem from '@/components/FlatListItem';
import FlatListEmpty from '@/components/FlatListEmpty';
import { useFocusEffect } from 'expo-router';
import ModalPreview from '@/components/ModalPreview';
import { ImagePickerResult } from '@/@types/imagePicker.r';
import { Entypo } from '@expo/vector-icons';


export type MediaType = 'images' | 'videos' | 'livePhotos';

export default function Home() {
  const { getAsyncStorage } = useAsyncStorage();
  const [selectedSource, setSelectedSource] = useState<ImagePickerResult | null>(null);
  const [formData, setFormData] = useState<any>([]);

  useFocusEffect(useCallback(() => {
    const fetchData = async () => {
      const data = await getAsyncStorage('formData');
      setFormData(data ? data : []);
      console.log(data.location)
    };
    fetchData();
  }, []))

  useEffect(() => {
    console.log(formData.location)
  }, [formData.location])

  return (
    <View className='flex-1 w-full bg-white relative'>
      <View className='flex flex-row items-center justify-center w-full mb-6 pt-16 pb-6 px-8 border-b border-gray-200'>
        <Text className='text-3xl font-bold text-gray-700'>Pagina Inicial</Text>
      </View>      
      <ScrollView className='w-full px-8' showsVerticalScrollIndicator={false}>
        {formData.length > 0 ? formData.map((data: any) => (
          <View key={`key-form-${data.nome}`}>
            <Text className='text-base mb-2'>Nome: {data.nome}</Text>
            <Text className='text-base mb-2'>Email: {data.email}</Text>
            <Text className='text-base mb-2'>Telefone: {data.telefone}</Text>
            <Text className='text-base mb-2'>Senha: {data.senha}</Text>
            <Text>{data.location.latitude}</Text>
            <Text>{data.location.longitude}</Text>
            {data.midias && data.midias.length > 0 && (
              <View className='mb-4'>
                <View className="flex-row items-center justify-between mb-4">
                  <Text className='text-lg font-semibold text-gray-700'>Galeria de Mídia:</Text>
                  {data.midias.length > 0 && (
                    <View className="bg-violet-100 px-3 py-1 rounded-full">
                      <Text className="text-violet-700 text-sm font-medium">
                        {data.midias.length} {data.midias.length === 1 ? 'item' : 'itens'}
                      </Text>
                    </View>
                  )}
                </View>
                <View className="bg-gray-50 rounded-xl p-2">
                  <FlatList
                    data={data.midias}
                    renderItem={({ item }) => (
                      <FlatListItem
                        item={item}
                        onPress={() => setSelectedSource(item)}
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
            )}
            {data.audios && data.audios.length > 0 && (
              <View className='mb-4'>
                <View className="flex-row items-center justify-between mb-4">
                  <Text className='text-lg font-semibold text-gray-700'>Galeria de Audios:</Text>
                  {data.audios.length > 0 && (
                    <View className="bg-violet-100 px-3 py-1 rounded-full">
                      <Text className="text-violet-700 text-sm font-medium">
                        {data.audios.length} {data.audios.length === 1 ? 'item' : 'itens'}
                      </Text>
                    </View>
                  )}
                </View>
                <View className="bg-gray-50 rounded-xl">
                  <FlatList
                    data={data.audios}
                    renderItem={({ item }) => (
                      <AudioPlayer key={item.url} url={item.url} />
                    )}
                    keyExtractor={(item) => `key-audio-${item.url}`}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{
                      gap: 10,
                      padding: 10
                    }}
                  />
                </View>
              </View>
            )}
          </View>
        )): <Text>Não tem intens para envio</Text>}
      </ScrollView>
      <TouchableOpacity
        className='absolute bg-violet-200 rounded-full p-5 bottom-10 right-10'
        onPress={() => navigate('/form')}
        >
        <Entypo name='add-to-list' size={20} color='#6d28d9'/>
      </TouchableOpacity>
      <ModalPreview
        visible={!!selectedSource}
        onClose={() => setSelectedSource(null)}
        source={selectedSource}
      />
    </View>
  );
}
