import { Inject, Injectable } from '@nestjs/common';
import { USER_CONFIG } from './user.token.js';
import type { UserConfig } from './user.config.js';

@Injectable()
export class UserService {
    constructor(
        @Inject(USER_CONFIG)
        private readonly config: UserConfig,
    ) {}
    getHello(): string {
        return `[App::Admin - Package::User] User --- ${this.config.itemLimit}`;
    }
}