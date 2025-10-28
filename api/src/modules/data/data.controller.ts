import { Controller, Get, Post, Body, Request, UseGuards, UseInterceptors } from '@nestjs/common';
import { DataService } from './data.service';
import { FileInterceptor } from '@nestjs/platform-express';

import { Data } from 'src/models/data';

import { Serializer } from 'src/infra/https/interceptors/serializer/serializer.decorator';

import { CreateData } from './data.dto';
import { GetCurrentUserId, Public } from '@infra/https/decorators';
import { AtGuard } from '@infra/https/guards';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('data')
export class DataController {
  constructor(private readonly dataService: DataService) {}

  @Public()
  @Get('/')
  @Serializer(Data)
  getAll(): Promise<Data[] | []> {
    return this.dataService.getAll();
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AtGuard)
  @Serializer(CreateData)
  @Post('/')
  @UseInterceptors(FileInterceptor('files'))
  create(
    @Body() data: any,
    @GetCurrentUserId() user_id: string
  ): Promise<Data> {
    const parsedData: CreateData = {
      ...data,
      files: JSON.parse(data.files),
      latitude: Number(data.latitude),
      longitude: Number(data.longitude)
    };

    return this.dataService.create(parsedData, user_id);
  }
}
