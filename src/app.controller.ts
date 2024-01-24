import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

// @Decorator
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // Nest uses HTTP verbs to map to methods.
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
