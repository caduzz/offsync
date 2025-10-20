
import { CreateUser } from '@models/user';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '@prisma/prisma.service';

import * as bcrypt from 'bcrypt';


@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateUser): Promise<User> {
    const hashedPassword = await this.hashData(data.password);
    
    return await this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });
  }

  async updateRtHash(user_id: string, refreshToken: string) {
    const hashed_rt = await this.hashData(refreshToken);

    await this.prisma.user.update({
      where: { id: user_id },
      data: { hashed_rt },
    });
  }

  async clearRtHash(user_id: string) {
    try { 
      return await this.prisma.user.update({
        where: {
          id: user_id,
          hashed_rt: { not: null }
        },
        data: { hashed_rt: null },
      });
    } catch (error) {
      return null;
    }
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return await this.prisma.user.findUnique({ where: { email } });
  }

  async findById(user_id: string): Promise<User | undefined> {
    return await this.prisma.user.findUnique({ where: { id: user_id } });
  }

  async hashData(data: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(data, saltRounds);
  }

  async compareHashedData(enteredData: string, hashedData: string): Promise<boolean> {
    return await bcrypt.compare(enteredData, hashedData);
  }
}