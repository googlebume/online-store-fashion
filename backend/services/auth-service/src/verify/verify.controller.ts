import { Controller, Query, Req, Sse } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Observable, Subject } from 'rxjs';
import { Request } from 'express';
import { OtpService } from '../auth-core/otp.service';
import { verifyTimerSchema } from '@packages/shared/common/swagger/response-schemas';

@ApiTags('Verification')
@Controller('fashion/verify')
export class VerifyController {
  constructor(private readonly otpService: OtpService) {}

  @Sse('time-remaining')
  @ApiOperation({ summary: 'Stream remaining OTP time for a login or registration flow' })
  @ApiQuery({ name: 'flowId', required: true, example: 'register-flow-123' })
  @ApiOkResponse({ description: 'SSE message payload', schema: verifyTimerSchema })
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
