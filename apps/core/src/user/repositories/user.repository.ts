import { AbstractRepository } from '@db/database/abstract.repository';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { hashSync } from 'bcryptjs';
import { Model } from 'mongoose';
import { RoleEnum } from '../entities/user-role.enum';
import { User, UserDocument } from '../entities/user.entity';

Injectable();
export class UserRepository extends AbstractRepository<UserDocument> {
  protected readonly logger = new Logger(UserRepository.name);

  constructor(
    @InjectModel(User.name) _userModel: Model<UserDocument>,
    private readonly _configService: ConfigService,
  ) {
    super(_userModel, User.name);
  }

  async createSuperUserIfDoesNotExist() {
    const user = await this.model.findOne({ role: RoleEnum.SuperAdmin });
    if (!user) {
      await this.model.create({
        firstName: this._configService.get<string>('SU_FIRST_NAME'),
        lastName: this._configService.get<string>('SU_LAST_NAME'),
        email: this._configService.get<string>('SU_EMAIL'),
        role: RoleEnum.SuperAdmin,
        password: hashSync(this._configService.get<string>('SU_PASSWORD')),
      });
    }
  }
}
