import {
  Args,
  Mutation,
  Query,
  Resolver,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { MerchantService } from './merchant.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { RequestUser } from 'src/auth/decorators/request-user.decorator';
import { MerchantGetQRDetailsArgs } from './args/merchant-get-qr-details.args';
import { MerchantPayQRArgs } from './args/merchant-pay-qr.args';
import { MerchantRequestQRArgs } from './args/merchant-request-qr.args';
import { User } from 'src/entities/user.entity';
import { MerchantPayment } from 'src/entities/merchant-payment.entity';
import { DatabaseService } from 'src/database/database.service';
import { ApiKey } from 'src/auth/decorators/api-key.decorator';
import { RequestMerchant } from 'src/auth/decorators/request-merchant.decorator';
import { UnauthorizedException } from '@nestjs/common';

@Resolver(() => MerchantPayment)
export class MerchantResolver {
  constructor(
    private readonly merchantService: MerchantService,
    private readonly databaseService: DatabaseService,
  ) {}

  @ResolveField()
  async merchant(@Parent() merchantPayment: MerchantPayment): Promise<User> {
    const user = await this.databaseService.userRepository.findOneBy({
      id: merchantPayment.merchantId,
    });

    return user;
  }

  @ApiKey()
  @Mutation(() => MerchantPayment)
  async merchantRequestQR(
    @RequestMerchant() merchant: User,
    @Args({ type: () => MerchantRequestQRArgs }) data: MerchantRequestQRArgs,
  ): Promise<MerchantPayment> {
    return this.merchantService.requestQR(merchant, data);
  }

  // To be checked by the merchant to see if the order has succeeded. Can also be used by the customer to check for the order details like currency and amount
  // User must input either API key or access token (Authentication)
  // and the user must be the merchant that created the merchant QR code (Authorization)
  @Auth(false)
  @ApiKey(false)
  @Query(() => MerchantPayment)
  async merchantGetQRDetails(
    @RequestUser() user: User,
    @RequestMerchant() merchant: User,
    @Args({ type: () => MerchantGetQRDetailsArgs })
    data: MerchantGetQRDetailsArgs,
  ): Promise<MerchantPayment> {
    if (!user && !merchant) {
      throw new UnauthorizedException('UNAUTHENTICATED');
    }

    return this.merchantService.getQRDetails(user ?? merchant, data);
  }

  // used by customers to pay for orders
  @Auth()
  @Mutation(() => MerchantPayment)
  async merchantPayQR(
    @RequestUser() user: User,
    @Args({ type: () => MerchantPayQRArgs }) data: MerchantPayQRArgs,
  ): Promise<MerchantPayment> {
    return this.merchantService.customerPayQR(user, data);
  }
}
