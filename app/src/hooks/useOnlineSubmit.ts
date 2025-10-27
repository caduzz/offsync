import { api } from '@/service/api';

import { FormDataDto, ISaveResponse } from '@/@types/form';
import { FileUploadResponse } from '@/service/models/files';
import { UploadFile } from '@/service/models/upload';
import { getFileNameFromUri } from '@/utils/getFileName';

export const useOnlineSubmit = () => {
  const handleSaveOnline = async ({ title, description, latitude, longitude, region_id, sounds = [], midias = [] }: FormDataDto): Promise<ISaveResponse> => {
    try {
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

      if(res) return {status: true};

      return {
        status: false
      };
    
    } catch (err) {
      return {
        status: false
      };
    }
  };

  return { handleSaveOnline };
};

export default useOnlineSubmit;
