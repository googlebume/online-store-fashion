import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';
import { JwtService } from '@nestjs/jwt';
import { MailerHandler } from '@packages/shared/dist/src/utils/libs/mailer/mailer.handler';
import { UserDataType } from '../types/UserData.type';

import { interval, map, Observable, takeUntil, takeWhile, tap } from 'rxjs';

dotenv.config()

@Injectable()
export class VerifyService {
    private verifyed: boolean = false;
    private userData: UserDataType | null = null;
    private code: string | null;

    constructor(
        private readonly jwtService: JwtService,
        private readonly mailer: MailerHandler,
    ) { }

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

    async verifyCode(userCode: string) {
        if (this.code === null) {
            console.log('КОД НАЛЛЛЛЛ')
            return { success: false };
        }

        if (this.code.toString() === userCode.toString()) {
            this.verifyed = true;
            return { success: true };
        }

        return { success: false };
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

        this.mailer.sendTextEmail(
            this.userData.email,
            'Verification Code',
            `Your verification code is: ${code}`
        )

        return {
            'code': this.code
        }
    }

    async generateToken<T extends { id: string, email: string, role: string[] }>(data: T): Promise<string> {
        const payload = {
            id: data.id,
            email: data.email,
            roles: data.role,
        }
        const token: string = await this.jwtService.sign(payload)
        return token
    }
    async verifyToken(token: string): Promise<boolean> {
        const isTokenValid = await this.jwtService.verify(token)
        return isTokenValid
    }

    getTimerStream(
        minutes: number,
        stop$: Observable<any>,
        onTick?: (remaining: number) => void
    ): Observable<{ data: { remaining: number } }> {

        let totalTime = minutes * 60;

        return interval(1000).pipe(
            map(() => {
                totalTime--;
                onTick && onTick(totalTime);
                if (totalTime <= 0) {
                    this.code = null
                }

                return { data: { remaining: totalTime } };
            }),
            takeWhile(() => totalTime > 0),
            takeUntil(stop$)
        );
    }
    clear() {
        this.code = null;
        this.userData = null;
        this.verifyed = false;
    }

}