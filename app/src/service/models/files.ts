export enum FileType {
  IMAGE = "image",
  VIDEO = "video",
  SOUND = "sound"
}

export type Files = {
  id: string
  type: FileType
  duration?: number
  url: string
}

export type FileUploadItem = {
  type: FileType;
  url: string
  duration?: number;
}

export type FileUploadResponse = {
  files: FileUploadItem[]
}