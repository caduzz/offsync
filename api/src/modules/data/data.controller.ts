import { Controller, Get, Post, Body, Request, UseGuards } from '@nestjs/common';
import { DataService } from './data.service';

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
  @Post('/')
  create(
    @Body() data: CreateData,
    @GetCurrentUserId() user_id: string
  ): Promise<Data> {
    return this.dataService.create(data, user_id);
  }
}
