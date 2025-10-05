import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerHandler {
    constructor() {}

    async sendTextEmail(to: string, subject: string, text: string){
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SEND_EMAIL_MAIL,
                pass: process.env.SEND_EMAIL_APP_PASS,
            },
        });

        await transporter.sendMail({
            from: process.env.SEND_EMAIL_MAIL,
            to: to,
            subject: subject,
            text: text,
        });
    }
}