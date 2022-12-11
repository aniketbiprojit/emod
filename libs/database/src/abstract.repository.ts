import { Logger, NotFoundException } from '@nestjs/common';
import { PaginationQueryDTO } from 'apps/core/src/user/dtos/pagination.dto';
import { FilterQuery, Model, Types, UpdateQuery, SaveOptions } from 'mongoose';
import { AbstractSchema } from './abstract.schema';

export abstract class AbstractRepository<TDocument extends AbstractSchema> {
  protected abstract readonly logger: Logger;

  constructor(
    protected readonly model: Model<TDocument>,
    protected readonly entity: string,
  ) {}

  protected async create(
    document: Omit<TDocument, '_id'>,
    options?: SaveOptions,
  ): Promise<TDocument> {
    const createdDocument = new this.model({
      ...document,
    });
    return (
      await createdDocument.save(options)
    ).toJSON() as unknown as TDocument;
  }

  async exists(filterQuery: FilterQuery<TDocument>): Promise<TDocument | null> {
    const document = await this.model.findOne(filterQuery, {}, {});

    return document;
  }

  async existsOrThrow<TError extends Error>(
    filterQuery: FilterQuery<TDocument>,
    err?: TError,
  ) {
    const document = await this.model.findOne(filterQuery, {}, {});

    if (document === null) {
      if (err) {
        throw err;
      }
      throw new NotFoundException(`${this.entity} not found.`);
    }

    return document;
  }

  async findOneAndUpdate(
    filterQuery: FilterQuery<TDocument>,
    update: UpdateQuery<TDocument>,
  ) {
    const document = await this.model.findOneAndUpdate(filterQuery, update, {
      lean: true,
      new: true,
    });

    if (!document) {
      throw new NotFoundException('Document not found.');
    }

    return document;
  }

  protected async upsert(
    filterQuery: FilterQuery<TDocument>,
    document: Partial<TDocument>,
  ) {
    return this.model.findOneAndUpdate(filterQuery, document, {
      upsert: true,
      new: true,
    });
  }

  async find(
    filterQuery: FilterQuery<TDocument>,
    paginated?: PaginationQueryDTO,
  ) {
    return this.model.find(
      filterQuery,
      { __v: false },
      {
        skip: paginated?.pageSize * (paginated?.page - 1),
        limit: paginated?.pageSize,
      },
    );
  }
}
