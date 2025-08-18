import { Controller, Get, Post, Body } from '@nestjs/common';
import { DataService } from './data.service';

import { Data } from 'src/models/data';
import { Serializer } from 'src/infra/https/interceptors/serializer/serializer.decorator';
import { CreateData } from './data.dto';

@Controller('data')
export class DataController {
  constructor(private readonly dataService: DataService) {}

  @Get('/')
  @Serializer(Data)
  getAll() {
    return this.dataService.getAll()
  }

  @Post('/')
  create(
    @Body() data: CreateData
  ) {
    this.dataService.create(data)
  }
}
