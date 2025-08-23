import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';
import { JwtService } from '@nestjs/jwt';

dotenv.config()

@Injectable()
export class VerifyService {
    constructor(
        private readonly jwtService: JwtService,
    ){
         
    }

    private userData: UserDataType | null = null;
    private code: string;
    verifyed: boolean = false

    setUserData(data: UserDataType): void {
        this.userData = data;
        console.log(`MAIL           `, this.userData.email)
    }
    getUserData(): UserDataType | null {
        return this.userData;
    }


    async getCede(): Promise<string | null> {
        return this.code;
    }

    async veryfyCode(userCode: string) {
        console.log(`Код:${this.code} Юзер:${userCode}`)
        
        if (this.code && userCode === this.code) {
            this.verifyed = true
            return { 'success': true }
        }
        return { 'success': false }
    }

    private generateCode(): string {
        this.code = Array.from({ length: 6 }, () => Math.floor(Math.random() * 10)).join('');
        return this.code
    }

    async sendVerificationCode(): Promise<object | null> {
        if (!this.userData?.email) return null;

        const code = this.generateCode();
        console.log(process.env.SEND_EMAIL_MAIL)
        console.log(process.env.SEND_EMAIL_APP_PASS)

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SEND_EMAIL_MAIL,
                pass: process.env.SEND_EMAIL_APP_PASS,
            },
        });

        await transporter.sendMail({
            from: process.env.SEND_EMAIL_MAIL,
            to: this.userData.email,
            subject: 'Verification Code',
            text: `Your verification code is: ${code}`,
        });

        return {
            'code': this.code
        }
    }

    async generateToken<T extends {id: string, email: string, roles: string[]}>(data: T): Promise<string>{
        const payload = {
            id: data.id,
            email: data.email,
            roles: data.roles,
        }
        const token: string = await this.jwtService.sign(payload)
        return token
    }
    async verifyToken(token: string): Promise<boolean> {
        const isTokenValid = await this.jwtService.verify(token)
        return isTokenValid
    }
}