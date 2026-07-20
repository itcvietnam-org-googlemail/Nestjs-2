import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from '@package/auth';
import { UserModule } from '@package/user';

@Module({
  imports: [AuthModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}