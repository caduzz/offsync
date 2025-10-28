import { Files, FileUploadItem } from "./files";
import { Locale } from "./locale";
import { Region } from "./region";

export type Data = {
  title: string
  id: string
  description: string
  locale: Locale
  region: Region
  files: Files[]
}

export type CreateData = {
  title: string
  description: string
  latitude: number
  longitude: number
  region_id: string
  files: FileUploadItem[]
}