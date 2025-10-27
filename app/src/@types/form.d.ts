import { RecorderState } from "expo-audio";
import { ImagePickerResult } from "./imagePicker";

export interface FormDataDto {
  title: string;
  description: string;
  midias: ImagePickerResult[];
  sounds: RecorderState[];
  region_id: string,
  latitude: number;
  longitude: number;
}

export interface ISaveResponse {
  status: boolean
}