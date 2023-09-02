import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { RegisterIndividualArgs } from './args/register-individual.args';
import { LoginArgs } from './args/login.args';
import { AuthPayload } from './payload/auth.payload';
import { RegisterBusinessArgs } from './args/register-business.args';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { AccountType } from './enums/accountType.enum';
import { JwtService } from '@nestjs/jwt';
import { LOGIN_JWT_PROVIDER } from 'src/jwt/login-token.jwt.module';
import dayjs from 'dayjs';
import { compare, hash } from 'bcrypt';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly databaseService: DatabaseService,
    @Inject(LOGIN_JWT_PROVIDER)
    private readonly loginTokenJwtService: JwtService,
  ) {}

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

        console.log(user);
        console.log(userInfo);
        console.log(businessInfo);

        return user;
      },
    );

    return { accessToken: await this.generateAccessToken(user.id) };
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

        return user;
      },
    );

    return { accessToken: await this.generateAccessToken(user.id) };
  }

  async login(data: LoginArgs): Promise<AuthPayload> {
    const user = await this.databaseService.userRepository.findOne({
      where: [
        { username: data.usernameOrEmail, accountType: data.accountType },
        { email: data.usernameOrEmail, accountType: data.accountType },
      ],
    });

    if (!user || !(await compare(data.password, user.password))) {
      throw new BadRequestException('Invalid username or password');
    }

    return { accessToken: await this.generateAccessToken(user.id) };
  }

  async generateAccessToken(userId: string): Promise<string> {
    return this.loginTokenJwtService.signAsync({
      userId,
      createdAt: dayjs().toISOString(),
    });
  }
}
