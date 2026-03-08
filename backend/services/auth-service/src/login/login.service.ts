import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { OtpService } from '../auth-core/otp.service';
import { TokenService } from '../auth-core/token.service';
import { UserIdentityService } from '../auth-core/user-identity.service';
import { LoginUserDTO } from '../dto/login-user.dto';

@Injectable()
export class LoginService {
  constructor(
    private readonly otpService: OtpService,
    private readonly tokenService: TokenService,
    private readonly userIdentityService: UserIdentityService,
  ) {}

  async initLogin(userData: LoginUserDTO) {
    const email = userData.email?.trim().toLowerCase();

    if (!email || !userData.password) {
      throw new HttpException('Email and password are required', HttpStatus.BAD_REQUEST);
    }

    const authResult = await this.userIdentityService.authenticate({
      email,
      password: userData.password,
    });

    if (!authResult.success || !authResult.user) {
      throw new HttpException(authResult.message || 'Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    const otpSession = await this.otpService.createAndSendSession('login', email, {
      user: authResult.user,
    });

    return {
      success: true,
      flowId: otpSession.flowId,
      expiresIn: otpSession.expiresIn,
      message: 'OTP code sent',
    };
  }

  async confirmLogin(flowId: string, code: string) {
    const otpResult = this.otpService.consumeSession(flowId, code, 'login');

    if (!otpResult.success) {
      throw new HttpException(otpResult.message || 'Invalid OTP code', HttpStatus.UNAUTHORIZED);
    }

    const userData = (otpResult.payload as { user: Record<string, any> }).user;

    const token = await this.tokenService.generateToken({
      id: userData.id,
      email: userData.email,
      role: this.userIdentityService.normalizeRoles(userData.role),
    });

    return {
      success: true,
      userData,
      token,
    };
  }
}
