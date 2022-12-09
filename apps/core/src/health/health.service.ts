import { OnModuleInit } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { CoreEnv } from '../environment';

@Injectable()
export class HealthService implements OnModuleInit {
  constructor(
    private readonly _configService: ConfigService,
    @InjectConnection() public readonly connection: Connection,
  ) {}

  async onModuleInit() {
    const configService = this._configService;
    if (configService.get<string>(CoreEnv.NODE_ENV) === 'testing') {
      console.log('Mongo URI', configService.get<string>(CoreEnv.MONGO_URI));
    }
    return this.connection.readyState === 1;
  }
}
