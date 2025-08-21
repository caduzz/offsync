import { UserRole } from "@prisma/client"
import { Exclude, Expose } from "class-transformer"
import { IsEmail, IsString } from "class-validator"

export class CreateUser {
  @Expose()
  @IsString()
  username: string

  @Expose()
  @IsString()
  password: string

  @Expose()
  @IsEmail()
  email: string
}