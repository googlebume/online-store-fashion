import { Injectable } from '@nestjs/common';
import { interval, Observable, takeUntil } from 'rxjs';
import { map } from 'rxjs/operators';
import { randomUUID } from 'crypto';
import { MailerHandler } from '@packages/shared/utils/libs/mailer/mailer.handler';

export type AuthFlowType = 'register' | 'login';

type OtpSession = {
  flowId: string;
  flowType: AuthFlowType;
  code: string;
  email: string;
  expiresAt: number;
  payload: Record<string, any>;
};

@Injectable()
export class OtpService {
  private readonly otpSessions = new Map<string, OtpSession>();
  private readonly otpTtlSeconds = 5 * 60;

  constructor(private readonly mailer: MailerHandler) {}

  async createAndSendSession(flowType: AuthFlowType, email: string, payload: Record<string, any>) {
    const session = this.createSession(flowType, email, payload);
    await this.sendVerificationCode(email, session.code);

    return {
      flowId: session.flowId,
      expiresIn: this.otpTtlSeconds,
    };
  }

  consumeSession(flowId: string, code: string, expectedFlowType: AuthFlowType) {
    this.cleanupExpiredSessions();
    const session = this.otpSessions.get(flowId);

    if (!session) {
      return { success: false, message: 'OTP session not found or expired' as const };
    }

    if (session.flowType !== expectedFlowType) {
      return { success: false, message: 'Invalid OTP flow type' as const };
    }

    if (session.code !== code) {
      return { success: false, message: 'Invalid OTP code' as const };
    }

    this.otpSessions.delete(flowId);

    return {
      success: true as const,
      payload: session.payload,
      email: session.email,
    };
  }

  getRemainingSeconds(flowId: string): number {
    this.cleanupExpiredSessions();
    const session = this.otpSessions.get(flowId);
    if (!session) return 0;
    return Math.max(0, Math.floor((session.expiresAt - Date.now()) / 1000));
  }

  getTimerStream(flowId: string, stop$: Observable<any>): Observable<{ data: { remaining: number } }> {
    return interval(1000).pipe(
      map(() => ({ data: { remaining: this.getRemainingSeconds(flowId) } })),
      takeUntil(stop$),
    );
  }

  private createSession(flowType: AuthFlowType, email: string, payload: Record<string, any>): OtpSession {
    this.cleanupExpiredSessions();

    const flowId = randomUUID();
    const code = this.generateCode();

    const session: OtpSession = {
      flowId,
      flowType,
      code,
      email: email.toLowerCase(),
      expiresAt: Date.now() + this.otpTtlSeconds * 1000,
      payload,
    };

    this.otpSessions.set(flowId, session);
    return session;
  }

  private async sendVerificationCode(email: string, code: string): Promise<void> {
    await this.mailer.sendTextEmail(
      email,
      'Verification Code',
      `Your verification code is: ${code}`,
    );
  }

  private generateCode(): string {
    return Array.from({ length: 6 }, () => Math.floor(Math.random() * 10)).join('');
  }

  private cleanupExpiredSessions(): void {
    const now = Date.now();
    for (const [flowId, session] of this.otpSessions.entries()) {
      if (session.expiresAt <= now) {
        this.otpSessions.delete(flowId);
      }
    }
  }
}
