import { HttpException, HttpStatus, Injectable, Inject } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { IDatabaseClient, IUserResponse } from '../interfaces/database-client.interface';
import { VerifyService } from '../verify/verify.service';

@Injectable()
export class LoginService {
  constructor(
    private readonly verifyService: VerifyService,
    @Inject('IDatabaseClient')
    private readonly databaseClient: IDatabaseClient,
  ) {}

  /**
   * Final login step after code verification
   */
  async confirmLoginAndLogin(code: string) {
    const verified = await this.verifyService.verifyCode(code);
    if (!verified.success) {
      throw new HttpException('Невірний код', HttpStatus.UNAUTHORIZED);
    }

    const userData = this.verifyService.getUserData();
    if (!userData?.email || !userData?.password) {
      throw new HttpException(
        'Дані користувача відсутні',
        HttpStatus.BAD_REQUEST,
      );
    }

    const response = await lastValueFrom<IUserResponse>(
      this.databaseClient.send('login_user', {
        email: userData.email,
        password: userData.password,
      }),
    );

    if (!response?.success || !response.user) {
      throw new HttpException(
        response?.message || 'Невірний email або пароль',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const token = await this.verifyService.generateToken({
      id: response.user.id,
      email: response.user.email,
      role: [response.user.role],
    });

    // 🔥 КРИТИЧНО: очищаємо state
    this.verifyService.clear();

    return {
      userData: response.user,
      token,
    };
  }

  async setUserData(userData: any) {
    await this.verifyService.setUserData(userData);
  }

  async sendCode() {
    await this.verifyService.sendVerificationCode();
  }
}
