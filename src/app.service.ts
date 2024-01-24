import { Injectable } from '@nestjs/common';

// Services Container
@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
