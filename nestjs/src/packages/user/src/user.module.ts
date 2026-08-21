import { Module } from '@nestjs/common';
import { ConfigService, ConfigModule } from '@package/config';

import Joi from 'joi';

import { UserController } from './user.controller.js';
import { UserService } from './user.service.js';
import { userConfig } from './user.config.js';
import { USER_CONFIG } from './user.token.js';
import { userValidationSchema } from './user.validation.js';
import type { UserConfig } from './user.config.js';

@Module({
    imports: [
        ConfigModule.forFeature({
            environmentSchema: userValidationSchema
        })
    ],
    exports: [
        UserService
    ],
    controllers: [UserController],
    providers: [
        {
            provide: USER_CONFIG,
            inject: [ConfigService],
            useFactory: (configService: ConfigService): UserConfig => {
                return {
                    ...userConfig,
                    ...(configService.get<UserConfig>('user') ?? {})
                };
            }
        },
        UserService
    ]
})

export class UserModule {}