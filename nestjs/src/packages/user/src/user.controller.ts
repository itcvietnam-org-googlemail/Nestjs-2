import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service.js';
//import { UserService } from '#user/user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getHello(): string {
    return this.userService.getHello();
  }
}