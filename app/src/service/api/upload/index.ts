import { UploadFile } from '@/service/models/upload';
import { axios } from '../axios';
import { FileUploadResponse } from '@/service/models/files';

import * as FileSystem from "expo-file-system";

async function image(image: Array<UploadFile>): Promise<FileUploadResponse> {
  const form = new FormData();
  image.forEach((file) => {
    form.append('files', {
      uri: file.uri,
      name: file.name,
      type: file.type === 'image' ? 'image/jpeg' : file.type
    } as any);
  });

  const { data } = await axios.post('/upload/image', form, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

  return data;
}

async function video(video: Array<UploadFile>): Promise<FileUploadResponse> {
  const form = new FormData();
  video.forEach((file) => {
    form.append('files', {
      uri: file.uri,
      name: file.name,
      type: file.type === 'video' ? 'video/mp4' : file.type
    } as any);
  });

  const { data } = await axios.post('/upload/video', form, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

  return data
}

async function sound(sound: Array<UploadFile>): Promise<FileUploadResponse> {
  const form = new FormData();

  for (const file of sound) {
    let uri = file.uri;
    if (!uri.startsWith("file://")) {
      uri = `file://${uri}`;
    }

    let type = file.type;
    if (!type) {
      if (uri.endsWith(".m4a")) type = "audio/mp4";
    }

    form.append("files", {
      uri,
      name: file.name || "recording.m4a",
      type,
    } as any);
  }
  try {
    const { data } = await axios.post("/upload/sound", form, {
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
    });

    return data;
  } catch (error: any) {
    throw error;
  }
}

const upload = { image, video, sound };

export default upload;