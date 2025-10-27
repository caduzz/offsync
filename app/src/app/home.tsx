import React, { useCallback } from 'react';
import { useEffect, useState } from 'react';
import { Text, FlatList, View, ScrollView, TouchableOpacity } from 'react-native';

import { navigate } from 'expo-router/build/global-state/routing';

import { useAsyncStorage } from '@/hooks/useAsyncStorage';

import AudioPlayer from '@/components/AudioPlayer';
import FlatListItem from '@/components/FlatListItem';
import FlatListEmpty from '@/components/FlatListEmpty';
import { useFocusEffect } from 'expo-router';
import ModalPreview from '@/components/ModalPreview';
import { ImagePickerResult } from '@/@types/imagePicker';
import { Entypo, FontAwesome} from '@expo/vector-icons';

import { useAuth } from '@/hooks/useAuth';
import { FormDataDto } from '@/@types/form';
import { TagConnected } from '@/components/TagConnected';

export type MediaType = 'images' | 'videos' | 'livePhotos';

export default function Home() {
  const { getAsyncStorage } = useAsyncStorage();
  const [selectedSource, setSelectedSource] = useState<ImagePickerResult | null>(null);
  const [formData, setFormData] = useState<any>([]);

  const { user } = useAuth()

  useFocusEffect(useCallback(() => {
    const fetchData = async () => {
      const data = await getAsyncStorage('formData');
      setFormData(data ? data : []);
    };
    fetchData();
  }, []))

  return (
    <View className='flex-1 w-full bg-white relative'>
      <View className='flex flex-col items-center justify-center w-full pt-16 pb-6 px-8 border-b border-gray-200'>
        <Text className='text-3xl font-bold text-gray-700'>Bem vindo ao offsync</Text>
        <Text className='text-2xl font-bold text-gray-700'>Você esta na conta {user?.username}</Text>
      </View>
      <View className='flex flex-row itens-between justify-between p-4'>

        <TagConnected connected="conectado" disconnected="desconectado"/>
      </View>
      <ScrollView className='w-full px-8 mt-4' contentContainerClassName='pb-20' showsVerticalScrollIndicator={false}>
        {formData.length > 0 ? formData.map((data: FormDataDto, index: number) => (
          <View key={`key-form-${index}`}>
            <View>
              <Text className='text-base mb-2'>Titulo: {data.title}</Text>
              <Text className='text-base mb-2'>Descrição: {data.description}</Text>
            </View>
            <View className='flex flex-row gap-4'>
              <Text>latitude: {data?.latitude.toFixed(4)}</Text>
              <Text>longitude: {data?.longitude.toFixed(4)}</Text>
            </View>
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
            {data.sounds && data.sounds.length > 0 && (
              <View className='mb-4'>
                <View className="flex-row items-center justify-between mb-4">
                  <Text className='text-lg font-semibold text-gray-700'>Galeria de Audios:</Text>
                  {data.sounds.length > 0 && (
                    <View className="bg-violet-100 px-3 py-1 rounded-full">
                      <Text className="text-violet-700 text-sm font-medium">
                        {data.sounds.length} {data.sounds.length === 1 ? 'item' : 'itens'}
                      </Text>
                    </View>
                  )}
                </View>
                <View className="bg-gray-50 rounded-xl">
                  <FlatList
                    data={data.sounds}
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
