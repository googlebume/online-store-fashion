import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { OtpService } from '../auth-core/otp.service';
import { TokenService } from '../auth-core/token.service';
import { UserIdentityService } from '../auth-core/user-identity.service';
import { RegisterUserDTO } from '../dto/register-user.dto';

@Injectable()
export class RegisterService {
  constructor(
    private readonly otpService: OtpService,
    private readonly tokenService: TokenService,
    private readonly userIdentityService: UserIdentityService,
  ) {}

  async initRegistration(userData: RegisterUserDTO) {
    const email = userData.email?.trim().toLowerCase();

    if (!email || !userData.name || !userData.password) {
      throw new HttpException('Missing required registration fields', HttpStatus.BAD_REQUEST);
    }

    const existingUser = await this.userIdentityService.getUserByEmail(email);

    if (!existingUser.success && existingUser.message) {
      throw new HttpException(existingUser.message, HttpStatus.BAD_GATEWAY);
    }

    if (existingUser.user) {
      throw new HttpException('User with this email already exists', HttpStatus.CONFLICT);
    }

    const otpSession = await this.otpService.createAndSendSession('register', email, {
      name: userData.name,
      email,
      password: userData.password,
    });

    return {
      success: true,
      flowId: otpSession.flowId,
      expiresIn: otpSession.expiresIn,
      message: 'OTP code sent',
    };
  }

  async confirmRegistration(flowId: string, code: string) {
    const otpResult = this.otpService.consumeSession(flowId, code, 'register');

    if (!otpResult.success) {
      throw new HttpException(otpResult.message || 'Invalid OTP code', HttpStatus.UNAUTHORIZED);
    }

    const pendingUser = otpResult.payload as RegisterUserDTO;

    const createResult = await this.userIdentityService.createUser({
      name: pendingUser.name,
      email: pendingUser.email,
      password: pendingUser.password,
    });

    if (!createResult.success || !createResult.user) {
      throw new HttpException(createResult.message || 'Registration failed', HttpStatus.CONFLICT);
    }

    const token = await this.tokenService.generateToken({
      id: createResult.user.id,
      email: createResult.user.email,
      role: this.userIdentityService.normalizeRoles(createResult.user.role),
    });

    return {
      success: true,
      message: 'Registration successful',
      userData: createResult.user,
      token,
    };
  }
}
