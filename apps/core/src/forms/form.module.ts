import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Form, FormSchema } from './entities/form.entitiy';
import { FormsController } from './form.controller';
import { FormsService } from './form.service';
import { FormsRepository } from './repositories/forms.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Form.name, schema: FormSchema }]),
  ],
  controllers: [FormsController],
  providers: [FormsService, FormsRepository],
})
export class FormsModule {}
