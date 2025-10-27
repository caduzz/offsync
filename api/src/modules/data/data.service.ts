import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/infra/prisma/prisma.service';
import { CreateData } from './data.dto';
import { Data } from '@models/data';

@Injectable()
export class DataService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateData, user_id: string): Promise<Data> {
    const createdData = await this.prisma.data.create({
      data: {
        title: data.title,
        description: data.description,
        locale: {
          create: {
            latitude: Number(data.latitude),
            longitude: Number(data.longitude),
          }
        },
        user: {
          connect: { id: user_id }
        },
        region: {
          connect: {
            id: data.region_id,
          }
        },
        files: {
          create: data.files
        }
      },
      select: {
        id: true,
        description: true,
        locale: {
          select: {
            id: true,
            latitude: true,
            longitude: true,
          }
        },
        region: {
          select: {
            id: true,
            name: true,
          }
        },
        files: {
          select: {
            id: true,
            url: true,
            type: true,
            duration: true,
          }
        },
      }
    }) as Data;

    return createdData;
  }

  async getAll(): Promise<Data[] | []> {
    const data = await this.prisma.data.findMany({
      include: {
        files: true,
        locale: true,
        region: true
      },
    }) as Data[];

    return data;
  }
}
