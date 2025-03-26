import { Controller, Get } from '@nestjs/common';
import { DatabaseService } from './database.service';

@Controller()
export class DatabaseController {
  constructor(private readonly appService: DatabaseService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
