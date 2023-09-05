import { Module } from '@nestjs/common';
import { SendgridService } from './sendgrid.service';
import sendgrid from '@sendgrid/mail';

@Module({
  imports: [],
  providers: [SendgridService],
  exports: [SendgridService],
})
export class SendgridModule {
  onModuleInit() {
    sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
  }
}
