import { AbstractRepository } from '@db/database/abstract.repository';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaginationQueryDTO } from '../../user/dtos/pagination.dto';
import { RoleEnum } from '../../user/entities/user-role.enum';
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
    return await this.model
      .findById(formId)
      .populate('formState')
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
      })
      .populate({
        path: 'formState',
        populate: {
          path: 'updatedBy',
        },
      });
  }

  async updateState(formId: string, toUser: User, updatedBy: User) {
    await this.existsOrThrow({ _id: formId });
    const form = await this.getForm(formId);

    if (form.rejected) {
      throw new BadRequestException('Form already rejected');
    }

    const lastFormState = await this._formStateModel
      .findById(form.formState.at(-1)._id)
      .populate({
        path: 'from',
      })
      .populate({
        path: 'to',
      });

    if (lastFormState.to) {
      throw new BadRequestException('Invalid form state - to exists');
    }

    const fromRole = lastFormState.from.role;

    if (fromRole === RoleEnum.VC) {
      throw new BadRequestException('Invalid form state - from role');
    }

    const allowedRole = Object.keys(RoleEnum).indexOf(fromRole) + 1;

    if (Object.keys(RoleEnum).indexOf(toUser.role) !== allowedRole) {
      throw new BadRequestException('Invalid form state - to role');
    }

    (lastFormState as any).to = toUser._id.toString();
    (lastFormState as any).updatedBy = updatedBy._id.toString();
    await lastFormState.save();

    const updatedState = await this._formStateModel.create({
      from: toUser._id.toString(),
    });

    await this.model.findOneAndUpdate(
      {
        _id: formId,
      },
      {
        $push: {
          formState: updatedState._id.toString(),
        },
      },
    );

    return await this.getForm(formId);
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
