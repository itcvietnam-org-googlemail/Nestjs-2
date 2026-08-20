import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { UserController } from './user.controller.js';
import { UserService } from './user.service.js';
import { userConfig } from './user.config.js';
import { USER_CONFIG } from './user.token.js';
import type { UserConfig } from './user.config.js';

@Module({
    imports: [],
    exports: [
        UserService
    ],
    controllers: [UserController],
    providers: [
        {
            provide: USER_CONFIG,
            inject: [ConfigService],
            useFactory: (
                configService: ConfigService,
            ): UserConfig => ({
                ...userConfig,
                ...(configService.get<UserConfig>('user') ?? {})
            })
        },
        UserService
    ]
})

export class UserModule {}