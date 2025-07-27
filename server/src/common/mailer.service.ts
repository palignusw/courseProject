
import * as nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailerService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'first.name.last.name.252003@gmail.com',
        pass: 'sydaiwayzodglxcv',
      },
    });
  }

  async sendMail(options: { to: string; subject: string; html: string }) {
    await this.transporter.sendMail({
      from: '"itshNick Support" <first.name.last.name.252003@gmail.com>',
      to: options.to,
      subject: options.subject,
      html: options.html,
    });
  }
}
