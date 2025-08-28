import { Controller, Get, Post, Body, UseGuards, Session, Request } from '@nestjs/common';
import { DataService } from './data.service';

import { Data } from 'src/models/data';

import { Serializer } from 'src/infra/https/interceptors/serializer/serializer.decorator';

import { AuthPayload } from '@models/auth';

import { CreateData } from './data.dto';

import { AuthGuard } from '@infra/https/guards/auth.guard';

@Controller('data')
export class DataController {
  constructor(private readonly dataService: DataService) {}

  @Get('/')
  @Serializer(Data)
  getAll() {
    return this.dataService.getAll();
  }

  @Post('/')
  @UseGuards(AuthGuard)
  create(
    @Body() data: CreateData,
    @Request() req: AuthPayload
  ) {
    this.dataService.create(data, req.user_id)
  }
}
