import { Controller, Req, Sse, Post, Body } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';
import { VerifyService } from './verify.service';
import { Request } from 'express';

@Controller('fashion/verify')
export class VerifyController {
  constructor(private readonly verifyService: VerifyService) { }

  @Sse('time-remaining')
  sendTime(@Req() req: Request): Observable<{ data: { remaining: number } }> {
    const stop$ = new Subject<void>()

    req.on('close', () => {
      console.log('end')
      stop$.next(),
        stop$.complete()
    })

    return this.verifyService.getTimerStream(5, stop$, (remaining) => console.log(remaining));
  }

  @Post('confirm')
  async confirmCode(@Body() body: { code: string }) {
    if (!body.code) {
      return { success: false, message: 'Код не передано' };
    }
    const result = await this.verifyService.verifyCode(body.code);
    if (result.success) {
      return { success: true, message: 'Код підтверджено' };
    } else {
      return { success: false, message: 'Невірний код' };
    }
  }
}
