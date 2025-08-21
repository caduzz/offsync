import { Expose, Type, Exclude } from "class-transformer";

import { IsEmail, IsString, IsStrongPassword, IsUUID } from "class-validator";

import { Data } from "./data";

export enum UserRole {
  User = "user",
  Admin = "admin"
}

export class User {
  @Expose()
  @IsUUID()
  @IsString()
  id: string

  @Expose()
  @IsString()
  username: string

  @Exclude()
  @IsStrongPassword()
  password: string

  @Expose()
  @IsEmail()
  email: string
  
  role: UserRole

  @Expose()
  @Type(() => Data)
  data: Data[]
}