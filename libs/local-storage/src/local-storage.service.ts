import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CoreEnv } from '../../../apps/core/src/environment';
import { randomUUID } from 'crypto';
import { readFileSync, writeFileSync } from 'fs';

@Injectable()
export class LocalStorageService {
  private _storagePath: string = '';

  constructor(private readonly _configService: ConfigService) {
    this._storagePath = this._configService.get<string>(
      CoreEnv.STORAGE_LOCATION,
    );
  }

  private _storeFile(data: Buffer): string {
    const key = randomUUID();
    const pathToFile = `${this._storagePath}/${key}`;

    writeFileSync(pathToFile, data, {
      encoding: 'binary',
    });
    return key;
  }

  private _readFile(key: string): Buffer {
    const pathToFile = `${this._storagePath}/${key}`;
    return readFileSync(pathToFile);
  }

  storeJSON(data: any): string {
    return this._storeFile(Buffer.from(JSON.stringify(data)));
  }

  readJSON(key: string): any {
    return JSON.parse(this._readFile(key).toString());
  }
}
