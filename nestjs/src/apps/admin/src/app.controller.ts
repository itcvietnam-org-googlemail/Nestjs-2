//Import(s)
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service.js';

//Export(s)
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}