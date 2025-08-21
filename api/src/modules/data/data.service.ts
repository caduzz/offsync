import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/infra/prisma/prisma.service';
import { CreateData } from './data.dto';

@Injectable()
export class DataService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateData) {
    return this.prisma.data.create({
      data: {
        description: data.description,
        locale: {
          create: {
            latitude: Number(data.latitude),
            longitude: Number(data.longitude),
          }
        },
        user: {
          connect: { id: "sadad" }
        },
        region: {
          connect: {
            id: data.region_id,
          }
        },
        files: {
          create: data.files
        }
      }
    })
  }

  getAll() {
    return this.prisma.data.findMany({
      include: {
        files: true,
        locale: true,
        region: true
      }
    })
  }
}
