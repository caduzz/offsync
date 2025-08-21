import { Controller, Get, Post, Body, UseGuards, Session, Request } from '@nestjs/common';
import { DataService } from './data.service';

import { Data } from 'src/models/data';
import { Serializer } from 'src/infra/https/interceptors/serializer/serializer.decorator';
import { CreateData } from './data.dto';
import { AuthGuard } from '@infra/https/guards/auth.guard';



@Controller('data')
export class DataController {
  constructor(private readonly dataService: DataService) {}

  @Get('/')
  @Serializer(Data)
  getAll(@Request() req: any) {
    return this.dataService.getAll();
  }

  @Post('/')
  create(
    @Body() data: CreateData
  ) {
    this.dataService.create(data)
  }
}
