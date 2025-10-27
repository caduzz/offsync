import { Expose } from "class-transformer";
import { IsString, IsUUID } from "class-validator";

export class Region {
  @Expose()
  @IsUUID()
  @IsString()
  id: string

  @Expose()
  @IsString()
  name: string
}

export class CreateRegion {
  @Expose()
  @IsString()
  name: string
}