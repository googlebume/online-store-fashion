import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class MailerHandler {
    private readonly resend = new Resend(process.env.RESEND_API_KEY);

    async sendTextEmail(to: string, subject: string, text: string): Promise<void> {
        await this.resend.emails.send({
            from: 'Fashion Store <onboarding@resend.dev>',
            to,
            subject,
            text,
        });
    }
}