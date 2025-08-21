
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '@prisma/prisma.service';

import * as bcrypt from 'bcrypt';

import { CreateUser } from './user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateUser): Promise<User> {
    const hashedPassword = await this.hashPassword(data.password);
    return await this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });
  }

  async findByUsername(username: string): Promise<User | undefined> {
    return await this.prisma.user.findUnique({ where: { username } });
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

  async comparePasswords(enteredPassword: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, hashedPassword);
  }
}