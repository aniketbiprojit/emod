import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { join } from 'path';
import { HealthService } from '../src/health/health.service';
import { CoreEnv } from '../src/environment';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from '../src/user/user.module';
import { FormModule } from '../src/forms/form.module';
import { AppController } from '../src/app.controller';
import { AppService } from '../src/app.service';
import { JwtService } from '../src/jwt/jwt.service';
import { AuthGuard } from '../src/user/auth/auth.guard';
import { RoleEnum } from '../src/user/entities/user-role.enum';

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
      .get('/user/users?role=AdminOfficer')
      .set('Authorization', `Bearer ${suToken}`)
      .expect(200);
    expect(response.body).toBeDefined();
    expect(response.body[0]).toBeDefined();
    expect(response.body[0].firstName).toEqual('Admin');
  }, 5_000);

  afterAll(async () => {
    const healthService = app.get<HealthService>(HealthService);
    await healthService.connection.dropDatabase();
    await healthService.connection.close();
  });
});
