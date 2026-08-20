//Import(s)
import { Injectable } from '@nestjs/common';

//Export(s)
@Injectable()
export class AppService {
  getHello(): string {
    return '[App::Admin] Hello World!';
  }
}