import { ApiProperty } from "@nestjs/swagger/dist/decorators/api-property.decorator";
import { Expose } from "class-transformer";
import { IsString } from "class-validator";

export class AuthDto {
  @ApiProperty({
    description: 'Email of the user',
    example: 'user@example.com'
  })
  @Expose()
  @IsString()
  email: string;
  
  @ApiProperty({
    description: 'Password of the user',
    example: 'StrongP@ssw0rd!'
  })
  @Expose()
  @IsString()
  password: string;
}