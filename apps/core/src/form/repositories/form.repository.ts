import { AbstractRepository } from '@db/database/abstract.repository';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FormState, FormStateDocument } from '../entities/form-state.entity';
import { Form, FormDocument } from '../entities/form.entitiy';

@Injectable()
export class FormRepository extends AbstractRepository<FormDocument> {
  protected readonly logger = new Logger(FormRepository.name);

  constructor(
    @InjectModel(FormState.name)
    private readonly _formStateModel: Model<FormStateDocument>,
    @InjectModel(Form.name) formModel: Model<FormDocument>,
    private readonly _configService: ConfigService,
  ) {
    super(formModel, Form.name);
  }

  initializeForm() {}
}
