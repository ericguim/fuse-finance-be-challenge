import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendEmail(content: string, to: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_USER,
        to,
        subject: 'Daily Transaction Report',
        text: content,
      });
    } catch (error) {
      console.error('Failed to send email:', error);
      throw error;
    }
  }
}
