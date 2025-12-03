
import { Injectable } from '@nestjs/common';
import { Region } from '@prisma/client';
import { PrismaService } from '@prisma/prisma.service';
import { CreateRegion } from 'src/models/region';

@Injectable()
export class RegionService {
  constructor(private prisma: PrismaService) {}

  async getAll(): Promise<Region[]> {
    const region = await this.prisma.region.findMany() as Region[];
  
    return region;
  }

  async create({ name }: CreateRegion): Promise<Region> {
    const createdRegion = await this.prisma.region.create({
      data: {
        name: name
      },
    }) as Region;
  
    return createdRegion;
  }
}
