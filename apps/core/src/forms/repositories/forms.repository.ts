import { AbstractRepository } from '@db/database/abstract.repository';
import { Injectable, Logger } from '@nestjs/common';
import { FormDocument } from '../entities/form.entitiy';

@Injectable()
export class FormsRepository extends AbstractRepository<FormDocument> {
  protected readonly logger = new Logger(FormsRepository.name);
}
