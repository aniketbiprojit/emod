import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
import { tmpdir } from 'os';
import { formFailMessage, formTestData } from './test-data';
import { Form } from '../src/form/entities/form.entitiy';

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
              [CoreEnv.STORAGE_LOCATION]: tmpdir(),
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
        forbidNonWhitelisted: false,
        whitelist: true,
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
  const admin = {
    _id: '',
    email: 'admin-officer@mail.com',
    password: 'password',
    firstName: 'Admin',
    lastName: 'Officer',
    role: RoleEnum.AdminOfficer,
  };
  const director = {
    _id: '',
    email: 'director@mail.com',
    password: 'password',
    firstName: 'Director',
    lastName: 'Wing',
    role: RoleEnum.Director,
  };
  const registrar = {
    _id: '',
    email: 'registrar@mail.com',
    password: 'password',
    firstName: 'Registrar',
    lastName: 'Office',
    role: RoleEnum.Registrar,
  };
  const finance = {
    _id: '',
    email: 'finance-officer@mail.com',
    password: 'password',
    firstName: 'Finance',
    lastName: 'Office',
    role: RoleEnum.FinanceOfficer,
  };
  describe('/user/create (POST)', () => {
    it('create admin officer', async () => {
      const response = await request(app.getHttpServer())
        .post('/user/create')
        .set('Authorization', `Bearer ${suToken}`)
        .send(admin)
        .expect(201);

      admin._id = response.body._id;

      expect(response.body).toEqual(
        expect.objectContaining({
          email: 'admin-officer@mail.com',
          firstName: 'Admin',
          lastName: 'Officer',
          role: 'AdminOfficer',
        }),
      );
    });

    it('create director', async () => {
      const response = await request(app.getHttpServer())
        .post('/user/create')
        .set('Authorization', `Bearer ${suToken}`)
        .send(director)
        .expect(201);

      director._id = response.body._id;

      expect(response.body).toEqual(
        expect.objectContaining({
          email: 'director@mail.com',
          firstName: 'Director',
          lastName: 'Wing',
          role: 'Director',
        }),
      );
    });

    it('create registrar', async () => {
      const response = await request(app.getHttpServer())
        .post('/user/create')
        .set('Authorization', `Bearer ${suToken}`)
        .send(registrar)
        .expect(201);

      registrar._id = response.body._id;

      expect(response.body).toEqual(
        expect.objectContaining({
          email: 'registrar@mail.com',
          firstName: 'Registrar',
          lastName: 'Office',
          role: 'Registrar',
        }),
      );
    });

    it('create finance officer', async () => {
      const response = await request(app.getHttpServer())
        .post('/user/create')
        .set('Authorization', `Bearer ${suToken}`)
        .send(finance)
        .expect(201);

      finance._id = response.body._id;

      expect(response.body).toEqual(
        expect.objectContaining({
          email: 'finance-officer@mail.com',
          firstName: 'Finance',
          lastName: 'Office',
          role: 'FinanceOfficer',
        }),
      );
    });
  });

  it('/user/users (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/user/users?role=AdminOfficer,Director,Registrar,FinanceOfficer')
      .set('Authorization', `Bearer ${suToken}`)
      .expect(200);
    expect(response.body).toBeDefined();
    expect(response.body[0]).toBeDefined();
    expect(response.body[3].email).toEqual('admin-officer@mail.com');
    expect(response.body[2].email).toEqual('director@mail.com');
    expect(response.body[1].email).toEqual('registrar@mail.com');
    expect(response.body[0].email).toEqual('finance-officer@mail.com');
  }, 5_000);

  it('/user/users (GET)', async () => {
    await request(app.getHttpServer())
      .get('/user/users?role=SuperAdmin')
      .set('Authorization', `Bearer ${suToken}`)
      .expect(400);
  });

  let formId = '';

  describe('form creation and fetching', () => {
    it('/form/create (POST)', async () => {
      const response = await request(app.getHttpServer())
        .post('/form/create')
        .set('Authorization', `Bearer ${suToken}`)
        .send({ formData: {} })
        .expect(400);
      expect(response.body).toEqual(formFailMessage);
    });

    it('/form/create (POST)', async () => {
      const token = await login(admin);
      const response = await request(app.getHttpServer())
        .post('/form/create')
        .set('Authorization', `Bearer ${token}`)
        .send({
          formData: formTestData,
          name: 'Test Form',
        } as InitializeFormDTO)
        .expect(201);
      formId = response.body._id;
    });

    it('/form (GET)', async () => {
      const response = await request(app.getHttpServer())
        .get('/form')
        .set('Authorization', `Bearer ${suToken}`)
        .expect(200);
      expect(response.body).toEqual(
        expect.objectContaining({
          forms: expect.arrayContaining([
            expect.objectContaining({
              name: 'Test Form',
              type: 'MOD',
              rejected: false,
              rejectedReason: '',
            }),
          ]),
        }),
      );
    });

    it('/form/:id (GET)', async () => {
      await request(app.getHttpServer())
        .get('/form/' + formId)
        .set('Authorization', `Bearer ${suToken}`)
        .expect(200);
    });

    it('/form/:id (PUT)', async () => {
      const token = await login(admin);
      const response = await request(app.getHttpServer())
        .put('/form/' + formId)
        .send({
          toUser: director._id,
        })
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
      const form = response.body.form as Form;
      const adminEmail = form.formState[0].from.email;
      expect(adminEmail).toEqual(admin.email);
      const directorEmail = form.formState[0].to!.email;
      expect(directorEmail).toEqual(director.email);
      const updatedByEmail = form.formState[0].updatedBy!.email;
      expect(updatedByEmail).toEqual(admin.email);
    });
  });

  describe('complete form', () => {
    it('/form/:id (PUT) by director', async () => {
      const token = await login(director);
      await request(app.getHttpServer())
        .put('/form/' + formId)
        .send({
          toUser: registrar._id,
        })
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    });

    it('/form/:id (PUT) by registrar', async () => {
      const token = await login(registrar);
      await request(app.getHttpServer())
        .put('/form/' + formId)
        .send({
          toUser: finance._id,
        })
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    });
  });

  describe('rejected form proceeds', () => {
    it('/form/create (POST)', async () => {
      const token = await login(admin);
      const response = await request(app.getHttpServer())
        .post('/form/create')
        .set('Authorization', `Bearer ${token}`)
        .send({
          formData: formTestData,
          name: 'Test Form 2',
        } as InitializeFormDTO)
        .expect(201);
      formId = response.body._id;
    });

    it('/form (GET)', async () => {
      const response = await request(app.getHttpServer())
        .get('/form')
        .set('Authorization', `Bearer ${suToken}`)
        .expect(200);
      expect(response.body).toEqual(
        expect.objectContaining({
          forms: expect.arrayContaining([
            expect.objectContaining({
              name: 'Test Form',
              type: 'MOD',
              rejected: false,
              rejectedReason: '',
            }),
          ]),
        }),
      );
    });

    it('/form/:id (GET)', async () => {
      await request(app.getHttpServer())
        .get('/form/' + formId)
        .set('Authorization', `Bearer ${suToken}`)
        .expect(200);
    });

    it('/form/:id (PUT)', async () => {
      const token = await login(admin);
      const response = await request(app.getHttpServer())
        .put('/form/' + formId)
        .send({
          toUser: director._id,
        })
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
      const form = response.body.form as Form;
      const adminEmail = form.formState[0].from.email;
      expect(adminEmail).toEqual(admin.email);
      const directorEmail = form.formState[0].to!.email;
      expect(directorEmail).toEqual(director.email);
      const updatedByEmail = form.formState[0].updatedBy!.email;
      expect(updatedByEmail).toEqual(admin.email);
    });

    it('/form/reject/:id (PUT)', async () => {
      const token = await login(director);
      const response = await request(app.getHttpServer())
        .put('/form/reject/' + formId)
        .send({
          rejectedReason: 'Rejected! Reason here',
        })
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
      const form = response.body.form;
      expect(form.rejected).toEqual(true);
      expect(form.rejectedReason).toEqual('Rejected! Reason here');
    });
  });

  afterAll(async () => {
    const healthService = app.get<HealthService>(HealthService);
    await healthService.connection.dropDatabase();
    await healthService.connection.close();
  });

  async function login(data: { email: string; password: string }) {
    const response = await request(app.getHttpServer())
      .post('/user/login')
      .send(data)
      .expect(201);
    expect(response.body).toHaveProperty('token');
    return `${response.body.token}`;
  }
});
