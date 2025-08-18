import { FileType } from "@prisma/client"

export interface CreateData {
  title: string
  description: string
  latitude: number
  longitude: number
  region_id: string
  files: {
    type: FileType
    url: string
  }[]
}