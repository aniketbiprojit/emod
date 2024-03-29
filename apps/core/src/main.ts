import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CoreEnv } from './environment';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get<ConfigService>(ConfigService);
  const port = configService.get<number>(CoreEnv.PORT);
  console.log(`Listening on port ${port}...`);

  const NODE_ENV = configService.get<string>(CoreEnv.NODE_ENV);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      forbidNonWhitelisted: false,
      whitelist: true,
    }),
  );

  if (NODE_ENV !== 'production') {
    app.enableCors();
  }

  await app.init();

  await app.listen(port);
}
bootstrap();
