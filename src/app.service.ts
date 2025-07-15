import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Get Hello World!';
  }

  setHello(): string {
    return 'Set Hello World!';
  }
}
