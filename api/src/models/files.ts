import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { IsNumber, IsString, IsUUID } from "class-validator";

export enum FileType {
  IMAGE = "image",
  VIDEO = "video",
  SOUND = "sound"
}

export class Files {
  @ApiProperty({
    description: 'Title of the file',
    example: 'Sample File Title'
  })
  @Expose()
  @IsUUID()
  @IsString()
  id: string
  
  @ApiProperty({
    description: 'Type of the file',
    example: FileType.IMAGE
  })
  @Expose()
  type: FileType

  @ApiProperty({
    description: 'Duration of the file in seconds (if applicable)',
    example: 120,
    required: false
  })
  @Expose()
  @IsNumber()
  duration?: number

  @ApiProperty({
    description: 'URL of the file',
    example: 'https://example.com/files/sample.jpg'
  })
  @Expose()
  @IsString()
  url: string
}

class FileUploadItem {
  @ApiProperty({
    description: 'Type of the file',
    example: FileType.IMAGE
  })
  @Expose()
  type: FileType;
  
  @ApiProperty({
    description: 'URL of the file',
    example: 'https://example.com/files/sample.jpg'
  })
  @Expose()
  @IsString()
  url: string

  @ApiProperty({
    description: 'Duration of the file in seconds (if applicable)',
    example: 120,
    required: false
  })
  @Expose()
  @IsNumber()
  duration?: number;
}

export class FileUploadResponse {
  @ApiProperty({
    description: 'List of uploaded files',
    type: [FileUploadItem]
  })
  @Expose()
  @Type(() => FileUploadItem)
  files: FileUploadItem[]
}