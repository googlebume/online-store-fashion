import { Controller, Query, Req, Sse } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';
import { Request } from 'express';
import { OtpService } from '../auth-core/otp.service';

@Controller('fashion/verify')
export class VerifyController {
  constructor(private readonly otpService: OtpService) {}

  @Sse('time-remaining')
  sendTime(
    @Query('flowId') flowId: string,
    @Req() req: Request,
  ): Observable<{ data: { remaining: number } }> {
    const stop$ = new Subject<void>();

    req.on('close', () => {
      stop$.next();
      stop$.complete();
    });

    return this.otpService.getTimerStream(flowId, stop$);
  }
}
