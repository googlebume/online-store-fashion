import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class VerifyService {
    private userData: UserDataType | null = null;

    setUserData(data: UserDataType): void {
        this.userData = data;
        console.log(`MAIL           `, this.userData)
    }

    async getUserData(): Promise<UserDataType | null> {
        return this.userData;
    }

    private generateCode(): string {
        return Array.from({ length: 6 }, () => Math.floor(Math.random() * 10)).join('');
    }

    async sendVerificationCode(): Promise<string | null> {
        if (!this.userData?.email) return null;

        const code = this.generateCode();

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'duzasergej@gmail.com',
                pass: 'dgzp odos fhvk ahcy',
            },
        });

        await transporter.sendMail({
            from: 'duzasergej@gmail.com',
            to: this.userData.email,
            subject: 'Verification Code',
            text: `Your verification code is: ${code}`,
        });

        return code;
    }
}
