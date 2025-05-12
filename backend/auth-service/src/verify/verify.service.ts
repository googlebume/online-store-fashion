import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { RegisterService } from 'src/register/register.service';

@Injectable()
export class VerifyService {
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


    // async sendCode() {
    //     this.generateCode();
    //     if (this.code) {
    //         return {
    //             'code': this.code
    //         }
    //     }
    // }
    async veryfyCode(userCode:string){
        console.log(`Код:${this.code} Юзер:${userCode}`)
        if (this.code && userCode === this.code) {
            this.verifyed = true
            return {'success': true}
        }
        return {'success': false}
    } 

    private generateCode(): string {
        this.code = Array.from({ length: 6 }, () => Math.floor(Math.random() * 10)).join('');
        return this.code
    }

    async sendVerificationCode(): Promise<object | null> {
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

            return {
                'code': this.code
            }
    }
}