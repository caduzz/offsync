import { Expose, Type } from "class-transformer";
import { Locale } from "./locale";
import { Region } from "./region";
import { Files } from "./files";
import { IsString, IsUUID } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class Data {
  @ApiProperty({
    description: 'Title of the data entry',
    example: 'This is a sample data entry.'
  })
  @Expose()
  @IsString()
  title: string

  @ApiProperty({
    description: 'Unique identifier for the data entry',
    example: 'd4e5f6g7-h8i9-j0k1-l2m3-n4o5p6q7r8s9'
  })
  @Expose()
  @IsUUID()
  @IsString()
  id: string

  @ApiProperty({
    description: 'Description of the data entry',
    example: 'This is a sample data entry description.'
  })
  @Expose()
  @IsString()
  description: string

  @ApiProperty({
    description: 'Locale associated with the data entry',
    type: Locale
  })
  @Expose()
  @Type(() => Locale)
  locale: Locale

  @ApiProperty({
    description: 'Region associated with the data entry',
    type: Region
  })
  @Expose()
  @Type(() => Region)
  region: Region

  @ApiProperty({
    description: 'Files associated with the data entry',
    type: [Files]
  })
  @Expose()
  @Type(() => Files)
  files: Files[]
}