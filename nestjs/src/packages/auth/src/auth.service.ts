import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  getHello(): string {
    return '[App::Admin - Package::Auth] Authentication!';
  }
}