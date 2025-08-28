import { Files } from "@models/files"
import { Expose, Type } from "class-transformer"
import { IsLatitude, IsLongitude, IsNumber, IsString, IsUUID } from "class-validator"

export class CreateData {
  @Expose()
  @IsString()
  title: string

  @Expose()
  @IsString()
  description: string

  @Expose()
  @IsNumber()
  @IsLatitude()
  latitude: number

  @Expose()
  @IsNumber()
  @IsLongitude()
  longitude: number

  @Expose()
  @IsUUID()
  region_id: string

  @Expose()
  @Type(() => Files)
  files: Files[]
}