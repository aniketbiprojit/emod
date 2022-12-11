import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LocalStorageModule } from '@storage/local-storage/local-storage.module';
import { LocalStorageService } from '@storage/local-storage/local-storage.service';
import { JwtService } from '../jwt/jwt.service';
import { FormState, FormStateSchema } from './entities/form-state.entity';
import { Form, FormSchema } from './entities/form.entitiy';
import { FormController } from './form.controller';
import { FormService } from './form.service';
import { FormRepository } from './repositories/form.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Form.name, schema: FormSchema }]),
    MongooseModule.forFeature([
      { name: FormState.name, schema: FormStateSchema },
    ]),
    LocalStorageModule,
  ],
  controllers: [FormController],
  providers: [FormService, FormRepository, JwtService, LocalStorageService],
})
export class FormModule {}
