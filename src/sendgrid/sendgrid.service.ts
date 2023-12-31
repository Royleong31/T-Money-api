import { BadRequestException, Injectable } from '@nestjs/common';
import sendgrid, { MailDataRequired } from '@sendgrid/mail';

@Injectable()
export class SendgridService {
  async send(data: MailDataRequired) {
    const [response] = await sendgrid.send(data, false);
    if (response.statusCode !== 202) {
      throw new BadRequestException('Failed to send email');
    }
  }
}
