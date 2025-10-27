import { Files } from "@models/files"
import { ApiProperty } from "@nestjs/swagger"
import { Expose, Type } from "class-transformer"
import { IsLatitude, IsLongitude, IsNumber, IsString, IsUUID } from "class-validator"

export class CreateData {
  @ApiProperty({
    description: 'Title of the data entry',
    example: 'This is a sample data entry.'
  })
  @Expose()
  @IsString()
  title: string

  @ApiProperty({
    description: 'Description of the data entry',
    example: 'This is a sample data entry.'
  })
  @Expose()
  @IsString()
  description: string

  @ApiProperty({
    description: 'Latitude coordinate',
    example: -23.55052
  })
  @Expose()
  @IsNumber()
  @IsLatitude()
  latitude: number

  @ApiProperty({
    description: 'Longitude coordinate',
    example: -46.633308
  })
  @Expose()
  @IsNumber()
  @IsLongitude()
  longitude: number

  @ApiProperty({
    description: 'Region ID associated with the data entry',
    example: 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6'
  })
  @Expose()
  @IsUUID()
  region_id: string

  @ApiProperty({
    description: 'Files associated with the data entry',
    type: [Files]
  })
  @Expose()
  @Type(() => Files)
  files: Files[]
}