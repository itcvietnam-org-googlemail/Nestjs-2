/*
* Import
*/
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@package/config';
import { AuthModule } from '@package/auth';
import { UserModule, UserEntity } from '@package/user';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AppEntity } from './app.entity.js';
import { appConfig, appPlainConfig } from './app.config.js';

/*
* Export
*/
@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: appPlainConfig
        }),

        TypeOrmModule.forRoot({
            type: 'postgres',
            host: 'postgresql',
            port: 5432,
            username: process.env.DB_USERNAME ?? 'root',
            password: 'nestjs-dev@123',
            database: process.env.DB_NAME ?? 'nestjs_dev',
            entities: [
                AppEntity,
                UserEntity
            ],
            synchronize: true
        }),

        AuthModule,
        UserModule
    ],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {}