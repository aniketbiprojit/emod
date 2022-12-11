import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LocalStorageService } from './local-storage.service';

@Module({
  providers: [LocalStorageService, ConfigService],
  exports: [LocalStorageService],
})
export class LocalStorageModule {}
