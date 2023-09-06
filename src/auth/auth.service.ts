import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { RegisterIndividualArgs } from './args/register-individual.args';
import { LoginRequestArgs } from './args/loginRequest.args';
import { LoginArgs } from './args/login.args';
import { AuthPayload } from './payload/auth.payload';
import { RegisterBusinessArgs } from './args/register-business.args';
import { User } from 'src/entities/user.entity';
import { AccountType } from './enums/accountType.enum';
import { JwtService } from '@nestjs/jwt';
import { LOGIN_TOKEN_JWT_PROVIDER } from 'src/jwt/login-token.jwt.module';
import dayjs from 'dayjs';
import { compare, hash } from 'bcrypt';
import { DatabaseService } from 'src/database/database.service';
import { SendgridService } from 'src/sendgrid/sendgrid.service';
import { hotp } from 'otplib';
import { LoginRequestPayload } from './payload/loginRequest.payload';
import { ACCESS_TOKEN_JWT_PROVIDER } from 'src/jwt/access-token.jwt.module';
import { GenerateApiKeyArgs } from './args/generate-api-keys.args';
import { ApiKeyPayload } from './payload/api-key.payload';
import crypto from 'crypto';
import { decodeBase64, encodeBase64 } from 'src/utils/base64Utils';

const OTP_EMAIL_SENDER = 'tmoney12345677@gmail.com';
const OTP_TEMPLATE_ID = 'd-224859c725144c51a32c72d9b7cf4ce9';

interface JWTPayload {
  userId: string;
  createdAt: string;
}

export enum JwtType {
  ACCESS_TOKEN,
  LOGIN_TOKEN,
}

@Injectable()
export class AuthService {
  constructor(
    private readonly databaseService: DatabaseService,
    @Inject(ACCESS_TOKEN_JWT_PROVIDER)
    private readonly accessTokenJwtService: JwtService,
    @Inject(LOGIN_TOKEN_JWT_PROVIDER)
    private readonly loginTokenJwtService: JwtService,
    private readonly sendgridService: SendgridService,
  ) {}

  jwtServiceMap: Record<JwtType, JwtService> = {
    [JwtType.ACCESS_TOKEN]: this.accessTokenJwtService,
    [JwtType.LOGIN_TOKEN]: this.loginTokenJwtService,
  };

  async getUserFromApiKey(apiKey: string): Promise<User> {
    try {
      const [base64Id, base64Secret] = apiKey.split(':');
      const id = decodeBase64(base64Id);
      const secret = decodeBase64(base64Secret);

      const apiKeyFound = await this.databaseService.apiKeyRepository.findOne({
        where: { id },
        relations: {
          merchant: true,
        },
      });

      if (!apiKeyFound || !(await compare(secret, apiKeyFound.hashedSecret))) {
        throw new BadRequestException('Invalid API key');
      }

      return apiKeyFound.merchant;
    } catch (error) {
      throw new BadRequestException('Invalid API key');
    }
  }

  async generateApiKey(
    merchant: User,
    data: GenerateApiKeyArgs,
  ): Promise<ApiKeyPayload> {
    const secret = crypto.randomUUID();
    const hashedSecret = await hash(secret, 10);

    const apiKey = this.databaseService.apiKeyRepository.create({
      merchantId: merchant.id,
      type: data.type,
      hashedSecret,
      label: data.label,
    });

    await this.databaseService.apiKeyRepository.save(apiKey);

    const apiKeyString = `${encodeBase64(apiKey.id)}:${encodeBase64(secret)}`;
    return { apiKey: apiKeyString };
  }

  async getUserFromAuthToken(
    accessToken: string,
    jwtType: JwtType,
  ): Promise<User> {
    try {
      const payload: JWTPayload = await this.jwtServiceMap[jwtType].verifyAsync(
        accessToken,
      );

      const user = await this.databaseService.userRepository.findOneBy({
        id: payload.userId,
      });

      return user;
    } catch (error) {
      return null;
    }
  }

  async registerBusiness(data: RegisterBusinessArgs): Promise<AuthPayload> {
    const user = await this.databaseService.dataSource.transaction(
      async (manager) => {
        const userRepository = manager.withRepository(
          this.databaseService.userRepository,
        );
        const userInfoRepository = manager.withRepository(
          this.databaseService.userInfoRepository,
        );

        const businessInfoRepository = manager.withRepository(
          this.databaseService.businessInfoRepository,
        );

        const user = userRepository.create({
          username: data.username,
          email: data.email,
          password: await hash(data.password, 10),
          accountType: AccountType.BUSINESS,
          otpSecret: Math.round(Math.random() * 10 ** 16).toString(16),
        });

        await manager.save(user);

        const userInfo = userInfoRepository.create({
          firstName: data.firstName,
          lastName: data.lastName,
          dateOfBirth: data.dateOfBirth,
          country: data.country,
          postcode: data.postcode,
          occupation: data.occupation,
          userId: user.id,
        });
        await manager.save(userInfo);

        const businessInfo = businessInfoRepository.create({
          name: data.businessName,
          uen: data.uen,
          country: data.businessCountry,
          postalCode: data.businessPostcode,
          address: data.businessAddress,
          userId: user.id,
        });
        await manager.save(businessInfo);

        return user;
      },
    );

    return {
      accessToken: await this.generateAccessToken(
        user.id,
        JwtType.ACCESS_TOKEN,
      ),
    };
  }

  async registerIndividual(data: RegisterIndividualArgs): Promise<AuthPayload> {
    const user = await this.databaseService.dataSource.transaction(
      async (manager) => {
        const userRepository = manager.withRepository(
          this.databaseService.userRepository,
        );
        const userInfoRepository = manager.withRepository(
          this.databaseService.userInfoRepository,
        );

        const user = userRepository.create({
          username: data.username,
          email: data.email,
          password: await hash(data.password, 10),
          accountType: AccountType.INDIVIDUAL,
          otpSecret: Math.round(Math.random() * 10 ** 16).toString(16),
        });

        await manager.save(user);

        const userInfo = userInfoRepository.create({
          firstName: data.firstName,
          lastName: data.lastName,
          dateOfBirth: data.dateOfBirth,
          country: data.country,
          postcode: data.postcode,
          occupation: data.occupation,
          userId: user.id,
        });
        await manager.save(userInfo);

        return user;
      },
    );

    return {
      accessToken: await this.generateAccessToken(
        user.id,
        JwtType.ACCESS_TOKEN,
      ),
    };
  }

  async loginRequest(data: LoginRequestArgs): Promise<LoginRequestPayload> {
    const user = await this.databaseService.userRepository.findOne({
      where: [
        { username: data.usernameOrEmail, accountType: data.accountType },
        { email: data.usernameOrEmail, accountType: data.accountType },
      ],
    });

    if (!user || !(await compare(data.password, user.password))) {
      throw new BadRequestException('Invalid username or password');
    }

    const loginToken = await this.generateAccessToken(
      user.id,
      JwtType.LOGIN_TOKEN,
    );

    const otp = await this.generateOtp(user);
    await this.sendOtpEmail(user, otp);

    return { loginToken };
  }

  async login(data: LoginArgs): Promise<AuthPayload> {
    // TODO: Use a separate JWT secret for login request with 30min expiry. Check that the otp counter in the loginToken matches the latest one in DB
    const user = await this.getUserFromAuthToken(
      data.loginToken,
      JwtType.LOGIN_TOKEN,
    );

    if (!user) {
      throw new BadRequestException('Invalid login token');
    }

    if (
      user.otpSentDate &&
      dayjs(user.otpSentDate).isAfter(dayjs().subtract(15, 'minute')) &&
      !hotp.verify({
        token: data.otp,
        secret: user.otpSecret,
        counter: user.otpCounter,
      })
    ) {
      throw new BadRequestException('Invalid OTP');
    }

    return {
      accessToken: await this.generateAccessToken(
        user.id,
        JwtType.ACCESS_TOKEN,
      ),
    };
  }

  async generateOtp(user: User): Promise<string> {
    user.otpCounter = user.otpCounter + 1;
    user.otpSentDate = new Date();
    await this.databaseService.userRepository.save(user);

    return hotp.generate(user.otpSecret, user.otpCounter);
  }

  // TODO: Move to background job so that we can return immediately and retry failed jobs
  async sendOtpEmail(user: User, otp: string) {
    await this.sendgridService.send({
      from: OTP_EMAIL_SENDER,
      to: user.email,
      subject: 'T Money Login OTP',
      templateId: OTP_TEMPLATE_ID,
      dynamicTemplateData: {
        username: user.username,
        OTP: otp,
      },
    });
  }

  async generateAccessToken(userId: string, jwtType: JwtType): Promise<string> {
    return this.jwtServiceMap[jwtType].signAsync({
      userId,
      createdAt: dayjs().toISOString(),
    } as JWTPayload);
  }
}
