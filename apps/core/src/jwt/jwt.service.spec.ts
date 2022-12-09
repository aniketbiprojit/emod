import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { RoleEnum } from '../user/entities/user-role.enum';
import { JwtService } from './jwt.service';

describe('JwtService', () => {
  let service: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [
            () => ({
              JWT_SECRET: 'secret',
            }),
          ],
        }),
      ],
      providers: [ConfigService, JwtService],
    }).compile();

    service = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('hash and verify', () => {
    const userData = {
      email: 'mail@mail.com',
      role: RoleEnum.Director,
      _id: '123',
    };
    const jwt = service.getJWT(userData);

    const payload = service.verifyJWT(jwt);

    expect({ email: payload.email, role: payload.role, _id: '123' }).toEqual(
      userData,
    );
  });
});
