import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class MailerHandler {
    constructor() {}

    async sendTextEmail(to: string, subject: string, text: string): Promise<void> {
        const resend = new Resend(process.env.RESEND_API_KEY);
        const { error } = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to,
            subject,
            text,
        });
        if (error) throw new Error(error.message);
    }
}