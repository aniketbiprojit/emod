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

export class ModDTO {
  budgetCode!: string;

  allocationAmount!: number;

  amountSpent!: number;

  title!: string;

  description?: string;

  serviceName!: string;

  serviceCost!: number;

  sourceOfFunding!: string;

  otherFields?: Record<string, any>;
}

export abstract class GetForm {
  form!: Form;

  formData!: ModDTO;
}

export type JWTPayload = {
  email: string;
  role: RoleEnum;
  _id: string;
};

export const formTestData = {
  allocationAmount: 'number',
  budgetCode: 'text',
  amountSpent: 'number',
  title: 'text',
  description: `textarea`,
  serviceCost: 'number',
  serviceName: 'text',
  sourceOfFunding: 'text',
};

export const formDefaultData = {
  allocationAmount: 10_000,
  budgetCode: 'text',
  amountSpent: 10_000,
  title: 'text',
  description: `textarea added description`,
  serviceCost: 20_000,
  serviceName: 'text',
  sourceOfFunding: 'text',
  // allocationAmount: '',
  // budgetCode: '',
  // amountSpent: '',
  // title: '',
  // description: '',
  // serviceCost: '',
  // serviceName: '',
  // sourceOfFunding: '',
};
