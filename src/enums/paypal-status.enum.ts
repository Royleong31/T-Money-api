import { registerEnumType } from '@nestjs/graphql';

export enum PayPalStatus {
  BEFORE_REQUEST = 'BEFORE_REQUEST', // before request is sent to paypal (paypal id is null at this point)
  PENDING = 'PENDING', // after request to paypal is sent, but before confirmation
  COMPLETED = 'COMPLETED', // after confirmation from paypal
  FAILED = 'FAILED', // after multiple failed attempts to confirm with paypal
}

registerEnumType(PayPalStatus, {
  name: 'PayPalStatus',
});
