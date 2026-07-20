import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  getHello(): string {
    return '[App::Admin - Package::User] User!';
  }
}