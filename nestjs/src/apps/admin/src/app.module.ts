//Import(s)
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '@package/auth';
import { UserModule } from '@package/user';

import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AppEntity } from './app.entity.js';

import { appConfig } from './app.config.js';

//Metadata(s)
@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: appConfig
        }),

        TypeOrmModule.forRoot({
            type: 'postgres',
            host: 'postgresql',
            port: 5432,
            username: process.env.DB_USERNAME ?? 'root',
            password: 'nestjs-dev@123',
            database: process.env.DB_NAME ?? 'nestjs_dev',
            entities: [
                AppEntity
            ],
            synchronize: true
        }),

        AuthModule,
        UserModule
    ],
    controllers: [AppController],
    providers: [AppService]
})

//Export(s)
export class AppModule {}