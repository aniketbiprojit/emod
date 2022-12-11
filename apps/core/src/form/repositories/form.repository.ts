import { AbstractRepository } from '@db/database/abstract.repository';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaginationQueryDTO } from '../../user/dtos/pagination.dto';
import { User } from '../../user/entities/user.entity';
import { InitializeFormDTO } from '../dtos/initialize-mod-form.dto';
import { FormState, FormStateDocument } from '../entities/form-state.entity';
import { Form, FormDocument, FormTypeEnum } from '../entities/form.entitiy';

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

  async initializeForm(
    data: InitializeFormDTO,
    user: User,
    storage: {
      storageType: string;
      location: string;
    },
  ) {
    const initialFormState = await this._formStateModel.create({
      from: user._id.toString(),
    });

    const form = await this.model.create({
      type: FormTypeEnum.MOD,
      formState: [initialFormState._id.toString()],
      name: data.name,
      ...storage,
    });

    return form as FormDocument;
  }

  async getForm(formId: string) {
    return await this.model.findById(formId).populate({
      path: 'formState',
      populate: {
        path: 'from',
      },
    });
  }

  async findAll(query: any = {}, paginated?: PaginationQueryDTO) {
    return this.model
      .find(query, '-__v', {
        skip: paginated?.pageSize * (paginated?.page - 1),
        limit: paginated?.pageSize,
        sort: { createdAt: -1, updatedAt: -1 },
      })
      .populate({
        path: 'formState',
        populate: {
          path: 'from',
        },
      })
      .populate({
        path: 'formState',
        populate: {
          path: 'to',
        },
      });
  }
}
