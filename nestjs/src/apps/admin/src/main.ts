// Import(s)
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

// Definition(s)
async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    //app.enableShutdownHooks();
    await app.listen(
        process.env.APP_PORT ?? process.env.PORT ?? 3000
    );
}

// Bootstrap
bootstrap();