import { Injectable, NotFoundException } from '@nestjs/common';
import { LocalStorageService } from '@storage/local-storage/local-storage.service';
import { PaginationQueryDTO } from '../user/dtos/pagination.dto';
import { User } from '../user/entities/user.entity';
import { InitializeFormDTO } from './dtos/initialize-mod-form.dto';
import { FormRepository } from './repositories/form.repository';

@Injectable()
export class FormService {
  constructor(
    private readonly _formRepository: FormRepository,
    private readonly _localStorageService: LocalStorageService,
  ) {}

  async initializeForm(data: InitializeFormDTO, user: User) {
    const location = this._localStorageService.storeJSON(data.formData);

    return await this._formRepository.initializeForm(data, user, {
      storageType: 'local',
      location: location,
    });
  }

  async getForm(id: string) {
    await this._formRepository.existsOrThrow(
      { _id: id },
      new NotFoundException('Form not found'),
    );

    return await this._formRepository.getForm(id);
  }

  async getForms(query: any = {}, paginated?: PaginationQueryDTO) {
    return { forms: await this._formRepository.findAll(query, paginated) };
  }
}
