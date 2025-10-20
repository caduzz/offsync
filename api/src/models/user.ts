import { Expose, Type, Exclude } from "class-transformer";

import { IsEmail, IsString, IsStrongPassword, IsUUID } from "class-validator";

import { Data } from "./data";
import { ApiProperty } from "@nestjs/swagger";

export enum UserRole {
  User = "user",
  Admin = "admin"
}

export class User {
  @ApiProperty({
    description: 'Unique identifier of the user',
    example: 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6'
  })
  @Expose()
  @IsUUID()
  @IsString()
  id: string

  @ApiProperty({
    description: 'Username of the user',
    example: 'john_doe'
  })
  @Expose()
  @IsString()
  username: string

  @ApiProperty({
    description: 'Password of the user',
    example: 'StrongP@ssw0rd!'
  })
  @Exclude()
  @IsStrongPassword()
  password: string

  @ApiProperty({
    description: 'Email of the user',
    example: 'john_doe@example.com'
  })
  @Expose()
  @IsEmail()
  email: string
  
  @ApiProperty({
    description: 'Role of the user',
    example: UserRole.User
  })
  @Expose()
  role: UserRole

  @ApiProperty({
    description: 'Data entries created by the user',
    type: [Data]
  })
  @Expose()
  @Type(() => Data)
  data: Data[]
}

export class CreateUser {
  @ApiProperty({
    description: 'Username of the user',
    example: 'john_doe'
  })
  @Expose()
  @IsString()
  username: string
  
  @ApiProperty({
    description: 'Password of the user',
    example: 'StrongP@ssw0rd!'
  })
  @Expose()
  @IsString()
  password: string

  @ApiProperty({
    description: 'Email of the user',
    example: 'john_doe@example.com'
  })
  @Expose()
  @IsEmail()
  email: string
}