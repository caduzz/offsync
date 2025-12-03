import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { RegionService } from './region.service';
import { AtGuard } from '@infra/https/guards';
import { Serializer } from '@infra/https/interceptors/serializer/serializer.decorator';

import { ApiBearerAuth } from '@nestjs/swagger';
import { CreateRegion, Region } from 'src/models/region';

@Controller('region')
export class RegionController {
  constructor(private readonly regionService: RegionService) {}

  @ApiBearerAuth('access-token')
  @UseGuards(AtGuard)
  @Get('/')
  @Serializer(Region)
  async getAll(): Promise<Region[]> {
    return await this.regionService.getAll();
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AtGuard)
  @Post('/')
  @Serializer(Region)
  async create(@Body() { name }: CreateRegion): Promise<Region> {
    return await this.regionService.create({ name });
  }
}
