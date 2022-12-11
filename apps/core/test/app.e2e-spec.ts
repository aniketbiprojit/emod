import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { join } from 'path';
import { HealthService } from '../src/health/health.service';
import { CoreEnv } from '../src/environment';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from '../src/user/user.module';
import { FormModule } from '../src/form/form.module';
import { AppController } from '../src/app.controller';
import { AppService } from '../src/app.service';
import { JwtService } from '../src/jwt/jwt.service';
import { AuthGuard } from '../src/user/auth/auth.guard';
import { RoleEnum } from '../src/user/entities/user-role.enum';
import { InitializeFormDTO } from '../src/form/dtos/initialize-mod-form.dto';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  let suToken: string = '';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [
            () => ({
              [CoreEnv.PORT]: 3000,
              [CoreEnv.MONGO_URI]: 'mongodb://localhost:27017/e-mod-test',
              [CoreEnv.JWT_SECRET]: 'secret',
              [CoreEnv.NODE_ENV]: 'testing',
              SU_FIRST_NAME: 'Super',
              SU_LAST_NAME: 'Admin',
              SU_EMAIL: 'su@mail.com',
              SU_PASSWORD: 'password',
            }),
          ],
        }),
        MongooseModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: async (configService: ConfigService) => ({
            uri: configService.get<string>(CoreEnv.MONGO_URI),
          }),
          inject: [ConfigService],
        }),
        UserModule,
        FormModule,
      ],
      controllers: [AppController],
      providers: [
        HealthService,
        AppService,
        ConfigService,
        {
          provide: AuthGuard.name,
          useClass: AuthGuard,
        },
        JwtService,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        forbidNonWhitelisted: true,
      }),
    );
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer()).get('/').expect(200);
  });

  it('/user/login (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/user/login')
      .send({
        email: 'su@mail.com',
        password: 'password',
      })
      .expect(201);
    expect(response.body).toHaveProperty('token');
    suToken = response.body.token;
  });

  describe('/user/create (POST)', () => {
    it('create admin officer', async () => {
      const response = await request(app.getHttpServer())
        .post('/user/create')
        .set('Authorization', `Bearer ${suToken}`)
        .send({
          email: 'admin-officer@mail.com',
          password: 'password',
          firstName: 'Admin',
          lastName: 'Officer',
          role: RoleEnum.AdminOfficer,
        })
        .expect(201);
      expect(response.body).toEqual({
        email: 'admin-officer@mail.com',
        firstName: 'Admin',
        lastName: 'Officer',
        role: 'AdminOfficer',
      });
    });

    it('create director', async () => {
      const response = await request(app.getHttpServer())
        .post('/user/create')
        .set('Authorization', `Bearer ${suToken}`)
        .send({
          email: 'director@mail.com',
          password: 'password',
          firstName: 'Director',
          lastName: 'Wing',
          role: RoleEnum.Director,
        })
        .expect(201);
      expect(response.body).toEqual({
        email: 'director@mail.com',
        firstName: 'Director',
        lastName: 'Wing',
        role: 'Director',
      });
    });

    it('create registrar', async () => {
      const response = await request(app.getHttpServer())
        .post('/user/create')
        .set('Authorization', `Bearer ${suToken}`)
        .send({
          email: 'registrar@mail.com',
          password: 'password',
          firstName: 'Registrar',
          lastName: 'Office',
          role: RoleEnum.Registrar,
        })
        .expect(201);
      expect(response.body).toEqual({
        email: 'registrar@mail.com',
        firstName: 'Registrar',
        lastName: 'Office',
        role: 'Registrar',
      });
    });

    it('create finance officer', async () => {
      const response = await request(app.getHttpServer())
        .post('/user/create')
        .set('Authorization', `Bearer ${suToken}`)
        .send({
          email: 'finance-officer@mail.com',
          password: 'password',
          firstName: 'Finance',
          lastName: 'Office',
          role: RoleEnum.FinanceOfficer,
        })
        .expect(201);
      expect(response.body).toEqual({
        email: 'finance-officer@mail.com',
        firstName: 'Finance',
        lastName: 'Office',
        role: 'FinanceOfficer',
      });
    });
  });

  it('/user/users (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/user/users?role=AdminOfficer,Director,Registrar,FinanceOfficer')
      .set('Authorization', `Bearer ${suToken}`)
      .expect(200);
    expect(response.body).toBeDefined();
    expect(response.body[0]).toBeDefined();
    expect(response.body[0].email).toEqual('admin-officer@mail.com');
    expect(response.body[1].email).toEqual('director@mail.com');
    expect(response.body[2].email).toEqual('registrar@mail.com');
    expect(response.body[3].email).toEqual('finance-officer@mail.com');
  }, 5_000);

  it('/user/users (GET)', async () => {
    await request(app.getHttpServer())
      .get('/user/users?role=SuperAdmin')
      .set('Authorization', `Bearer ${suToken}`)
      .expect(400);
  });

  it('/form/create (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/form/create')
      .set('Authorization', `Bearer ${suToken}`)
      .send({ formData: {} })
      .expect(400);
    expect(response.body).toEqual({
      statusCode: 400,
      message: [
        'formData.budgetCode must be shorter than or equal to 255 characters',
        'formData.budgetCode should not be empty',
        'formData.budgetCode must be a string',
        'formData.allocationAmount should not be empty',
        'formData.allocationAmount must be a number conforming to the specified constraints',
        'formData.amountSpent should not be empty',
        'formData.amountSpent must be a number conforming to the specified constraints',
        'formData.title must be shorter than or equal to 255 characters',
        'formData.title should not be empty',
        'formData.title must be a string',
        'formData.serviceName must be shorter than or equal to 255 characters',
        'formData.serviceName should not be empty',
        'formData.serviceName must be a string',
        'formData.serviceCost should not be empty',
        'formData.serviceCost must be a number conforming to the specified constraints',
        'formData.sourceOfFunding must be a string',
      ],
      error: 'Bad Request',
    });
  });

  it('/form/create (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/form/create')
      .set('Authorization', `Bearer ${suToken}`)
      .send({
        formData: {
          allocationAmount: 100_000,
          budgetCode: '31.12',
          amountSpent: 22_000,
          title: 'New request for authorization of expenditure',
          description: `Purpose: SASTRA is section-8 company of Rashtriya Raksha University. we have required SASTRA’S website as outreach events is going in full pace both physically and digitally, considering that a website is required to be hosted with basic pages and design alignments so that stakeholders can find us easily on the web along with a positive web identity. We have booked domain for this website- SASTRA.NET.IN and we will be processing for a basic website with one time cost with 6 months of changes and support.`,
          serviceCost: 22_000,
          serviceName: 'Test Services',
          sourceOfFunding: 'DIIS: 31.12 Office Expenses\n\nIT',
          remarks: { Original: 'School Office' },
        },
      } as InitializeFormDTO)
      .expect(201);
  });

  afterAll(async () => {
    const healthService = app.get<HealthService>(HealthService);
    await healthService.connection.dropDatabase();
    await healthService.connection.close();
  });
});
