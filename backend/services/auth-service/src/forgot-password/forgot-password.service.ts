import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { OtpService } from '../auth-core/otp.service';
import { TokenService } from '../auth-core/token.service';
import { UserIdentityService } from '../auth-core/user-identity.service';

@Injectable()
export class ForgotPasswordService {
  constructor(
    private readonly otpService: OtpService,
    private readonly tokenService: TokenService,
    private readonly userIdentityService: UserIdentityService,
  ) {}

  async initResetPassword(email: string, newPassword: string) {
    const normalizedEmail = email?.trim().toLowerCase();
    if (!normalizedEmail || !newPassword) {
      throw new HttpException('Email and new password are required', HttpStatus.BAD_REQUEST);
    }

    const existingUser = await this.userIdentityService.getUserByEmail(normalizedEmail);
    if (!existingUser.user) {
      throw new HttpException('User with this email does not exist', HttpStatus.NOT_FOUND);
    }

    const otpSession = await this.otpService.createAndSendSession('reset-password', normalizedEmail, {
      userId: existingUser.user.id,
      newPassword,
    });

    return {
      success: true,
      flowId: otpSession.flowId,
      expiresIn: otpSession.expiresIn,
      message: 'OTP code sent to your email',
    };
  }

  async confirmResetPassword(flowId: string, code: string) {
    const otpResult = this.otpService.consumeSession(flowId, code, 'reset-password');

    if (!otpResult.success) {
      throw new HttpException(otpResult.message || 'Invalid OTP code', HttpStatus.UNAUTHORIZED);
    }

    const { userId, newPassword } = otpResult.payload as { userId: string; newPassword: string };

    const updateResult = await this.userIdentityService.updateUser(userId, { password: newPassword });

    if (!updateResult.success || !updateResult.user) {
      throw new HttpException(updateResult.message || 'Password reset failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    const token = await this.tokenService.generateToken({
      id: updateResult.user.id,
      email: updateResult.user.email,
      role: this.userIdentityService.normalizeRoles(updateResult.user.role),
      name: updateResult.user.name != null ? String(updateResult.user.name) : undefined,
    });

    return {
      success: true,
      message: 'Password reset successful',
      userData: updateResult.user,
      token,
    };
  }
}
