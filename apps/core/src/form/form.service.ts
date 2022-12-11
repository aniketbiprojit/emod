import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { LocalStorageService } from '@storage/local-storage/local-storage.service';
import { PaginationQueryDTO } from '../user/dtos/pagination.dto';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { InitializeFormDTO } from './dtos/initialize-mod-form.dto';
import { FormRepository } from './repositories/form.repository';

@Injectable()
export class FormService {
  constructor(
    private readonly _formRepository: FormRepository,
    private readonly _userService: UserService,
    private readonly _localStorageService: LocalStorageService,
  ) {}

  async initializeForm(data: InitializeFormDTO, user: User) {
    const location = this._localStorageService.storeJSON(data.formData);

    return await this._formRepository.initializeForm(data, user, {
      storageType: 'local',
      location: location,
    });
  }

  async getFormById(id: string) {
    const form = await this._formRepository.existsOrThrow(
      { _id: id },
      new NotFoundException('Form not found'),
    );

    return {
      // populated
      form: (await this._formRepository.getForm(id)).toJSON(),
      formData: this._localStorageService.readJSON(form.location),
    };
  }

  async getForms(query: any = {}, paginated?: PaginationQueryDTO) {
    return { forms: await this._formRepository.findAll(query, paginated) };
  }

  async updateState(formId: string, toUserId: string, updatedBy: User) {
    const toUser = await this._userService.getUserById(toUserId);

    const form = await this._formRepository.updateState(
      formId,
      toUser,
      updatedBy,
    );
    return {
      form: form,
      formData: this._localStorageService.readJSON(form.location),
    };
  }

  async reject(id: string, rejectedReason: string) {
    const form = await this._formRepository.existsOrThrow(
      { _id: id },
      new NotFoundException('Form not found'),
    );

    if (form.rejected) {
      throw new BadRequestException('Form already rejected');
    }

    return {
      form: await this._formRepository.findOneAndUpdate(
        {
          _id: id,
        },
        {
          $set: {
            rejected: true,
            rejectedReason,
          },
        },
      ),
    };
  }
}
