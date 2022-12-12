export abstract class AbstractSchema {
  _id!: string;
  createdAt!: Date;
}

export enum FormTypeEnum {
  MOD = 'MOD',
}

export abstract class Form extends AbstractSchema {
  formState!: FormState[];
  name!: string;
  type!: FormTypeEnum;
  rejected?: boolean;
  rejectedReason?: string;
}

export abstract class FormState extends AbstractSchema {
  from!: User;
  to?: User;
  updatedBy?: User;
}

export enum RoleEnum {
  AdminOfficer = 'AdminOfficer',
  Director = 'Director',
  Registrar = 'Registrar',
  FinanceOfficer = 'FinanceOfficer',
  VC = 'VC',
  SuperAdmin = 'SuperAdmin',
}

export abstract class User extends AbstractSchema {
  firstName!: string;
  lastName!: string;
  email!: string;
  role!: RoleEnum;
}
