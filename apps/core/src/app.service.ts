import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';

@Injectable()
export class AppService {
  status() {
    const { version } = JSON.parse(
      readFileSync(
        join(__dirname, '..', '..', '..', 'package.json'),
      ).toString(),
    );
    return { status: 'ok', version: version };
  }
}
