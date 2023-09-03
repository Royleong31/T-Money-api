import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { MerchantService } from './merchant.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { RequestUser } from 'src/auth/decorators/request-user.decorator';
import { MerchantGetQRDetailsArgs } from './args/merchant-get-qr-details.args';
import { MerchantPayQRArgs } from './args/merchant-pay-qr.args';
import { MerchantRequestQRArgs } from './args/merchant-request-qr.args';
import { User } from 'src/entities/user.entity';
import { MerchantPayment } from 'src/entities/merchant-payment.entity';

@Resolver()
export class MerchantResolver {
  constructor(private readonly merchantService: MerchantService) {}

  @Auth()
  @Mutation(() => MerchantPayment)
  async merchantRequestQR(
    @RequestUser() merchant: User,
    @Args({ type: () => MerchantRequestQRArgs }) data: MerchantRequestQRArgs,
  ): Promise<MerchantPayment> {
    return this.merchantService.requestQR(merchant, data);
  }

  // To be checked by the merchant to see if the order has succeeded. Can also be used by the customer to check for the order details like currency and amount
  @Auth()
  @Query(() => MerchantPayment)
  async merchantGetQRDetails(
    @RequestUser() user: User,
    @Args({ type: () => MerchantGetQRDetailsArgs })
    data: MerchantGetQRDetailsArgs,
  ): Promise<MerchantPayment> {
    return this.merchantService.getQRDetails(user, data);
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
