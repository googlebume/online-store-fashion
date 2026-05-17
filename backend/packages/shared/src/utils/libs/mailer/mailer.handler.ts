import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerHandler {
    private readonly transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASSWORD,
        },
    });

    async sendTextEmail(to: string, subject: string, text: string): Promise<void> {
        await this.transporter.sendMail({
            from: `"Fashion Store" <${process.env.GMAIL_USER}>`,
            to,
            subject,
            text,
        });
    }
}