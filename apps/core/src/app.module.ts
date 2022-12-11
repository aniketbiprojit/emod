import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';

import * as Joi from 'joi';
import { JwtService } from './jwt/jwt.service';
import { AuthGuard } from './user/auth/auth.guard';
import { FormModule } from './form/form.module';
import { HealthService } from './health/health.service';
import { CoreEnv } from './environment';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        ...(process.env.USE_DOCKER
          ? ['.docker.env', join('apps', 'core', '.docker.env')]
          : []),
        '.env',
        join('apps', 'core', '.env'),
      ],
      validationSchema: Joi.object({
        [CoreEnv.PORT]: Joi.number().required(),
        [CoreEnv.MONGO_URI]: Joi.string().required(),
        [CoreEnv.JWT_SECRET]: Joi.string().required(),
        [CoreEnv.NODE_ENV]: Joi.string().required().default('development'),
        [CoreEnv.STORAGE_LOCATION]: Joi.string().default(join('storage')),
      }),
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>(CoreEnv.MONGO_URI),
      }),
      inject: [ConfigService],
    }),
    UserModule,
    FormModule,
  ],
  controllers: [AppController],
  providers: [
    HealthService,

    AppService,
    ConfigService,
    {
      provide: AuthGuard.name,
      useClass: AuthGuard,
    },
    JwtService,
  ],
})
export class AppModule {}
