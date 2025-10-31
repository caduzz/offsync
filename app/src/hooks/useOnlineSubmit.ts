import { useState } from 'react';
import { ToastAndroid } from 'react-native';

import { FormDataDto, ISaveResponse } from '@/@types/form';
import { FileUploadResponse } from '@/service/models/files';
import { UploadFile } from '@/service/models/upload';
import { getFileNameFromUri } from '@/utils/getFileName';

import { api } from '@/service/api';

export const useOnlineSubmit = () => {
  const [sending, setSend] = useState(false)

  const handleSaveOnline = async ({ title, description, latitude, longitude, region_id, sounds = [], midias = [] }: FormDataDto): Promise<ISaveResponse> => {
    try {
      setSend(true)
      let images_res: FileUploadResponse = {files: []};
      let videos_res: FileUploadResponse = {files: []};
      let sound_res: FileUploadResponse = {files: []};

      if (sounds.length) {
        const soundFiles: Array<UploadFile> = sounds.map(sound => ({
          uri: sound.url ? sound.url : 'new',
          name: getFileNameFromUri(sound.url, `record-${Date.now()}.m4a`),
          type: 'audio/mp4'
        }));
        sound_res = await api.upload.sound(soundFiles);
      }

      if (midias.length) {        
        const images: Array<UploadFile> = [];
        const videos: Array<UploadFile> = [];

        midias.forEach((midia) => {
          const file = {
            uri: (midia as any).uri,
            name: getFileNameFromUri((midia as any).uri, `media-${Date.now()}`),
            type: (midia as any).type === 'video' ? 'video/mp4' : 'image/jpeg'
          };

          if ((midia as any).type === 'video') videos.push(file);
          else images.push(file);
        });

        if (images.length) { 
          images_res = await api.upload.image(images);
        }
        if (videos.length) {
          videos_res = await api.upload.video(videos);
        } 
      }
      
      const res = await api.data.create({
        title,
        description,
        latitude,
        longitude,
        region_id,
        files: [
          ...images_res.files,
          ...videos_res.files,
          ...sound_res.files
        ],
      });

      setSend(false)
      
      if(res) {
        ToastAndroid.show('Arquivo salvo na nuvem com sucesso!', ToastAndroid.SHORT);
        return {status: true};
      }

      ToastAndroid.show('Erro ao salvar arquivo em nuvem!', ToastAndroid.SHORT);
      return {
        status: false
      };
    
    } catch (err) {
      setSend(false)
      ToastAndroid.show('Erro ao salvar arquivo em nuvem!', ToastAndroid.SHORT);
      return {
        status: false
      };
    }
  };

  return { handleSaveOnline, sending };
};

export default useOnlineSubmit;
