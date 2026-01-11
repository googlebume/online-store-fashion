import { HttpException, HttpStatus, Injectable, Inject } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { IDatabaseClient, IUserResponse } from '../interfaces/database-client.interface';
import * as bcrypt from 'bcryptjs';
import { VerifyService } from '../verify/verify.service';
import { RegisterUserDTO } from '../dto/register-user.dto';

/**
 * Register Service
 * SOLID Principle: Single Responsibility
 * Handles user registration business logic
 */
@Injectable()
export class RegisterService {
  constructor(
    private readonly verifyService: VerifyService,
    @Inject('IDatabaseClient')
    private readonly databaseClient: IDatabaseClient,
  ) {}

  /**
   * Set user data for verification
   */
  async setUserData(userData: RegisterUserDTO) {
    await this.verifyService.setUserData(userData);
  }

  /**
   * Send verification code
   */
  async sendCode() {
    await this.verifyService.sendVerificationCode();
  }

  /**
   * Confirm registration with verification code
   * @param code Verification code
   * @returns Success status
   */
  async confirmRegistration(code: string) {
    try {
      const verified = await this.verifyService.verifyCode(code);
      if (!verified.success) {
        return { success: false, message: 'Невірний код' };
      }

      const userData = this.verifyService.getUserData();
      if (!userData || !userData.email || !userData.password || !userData.name) {
        throw new HttpException('Дані користувача не знайдені', HttpStatus.BAD_REQUEST);
      }

      const hashedPassword = await this.hashPassword(userData.password);
      const userDataWithHashedPassword = {
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
      };

      const response = await lastValueFrom<IUserResponse>(
        this.databaseClient.send('add_new_user', userDataWithHashedPassword),
      );

      if (!response.success) {
        throw new HttpException(
          response.message || 'Користувач з таким email вже існує',
          HttpStatus.CONFLICT,
        );
      }

      return {
        success: true,
        message: 'Користувач успішно зареєстрований',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message || 'Помилка реєстрації',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Hash password using bcrypt
   * @param password Plain text password
   * @returns Hashed password
   */
  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }
}