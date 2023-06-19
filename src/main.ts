import { NestFactory } from '@nestjs/core';
import { LoggingInterceptor } from './app.interceptors';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });
  // app.useGlobalInterceptors(new LoggingInterceptor());
  app.enableCors();
  await app.listen(3002);
}
bootstrap();
