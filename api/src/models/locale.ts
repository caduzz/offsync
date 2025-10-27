import { Expose } from "class-transformer";
import { IsLatitude, IsLongitude, IsNumber, IsString, IsUUID } from "class-validator";

export class Locale {
  @Expose()
  @IsUUID()
  @IsString()
  id: string

  @Expose()
  @IsNumber()
  @IsLatitude()
  latitude: number

  @Expose()
  @IsNumber()
  @IsLongitude()
  longitude: number
}

export class CreateLocale {
  @Expose()
  @IsNumber()
  @IsLatitude()
  latitude: number

  @Expose()
  @IsNumber()
  @IsLongitude()
  longitude: number
}