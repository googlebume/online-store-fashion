import { Controller, Req, Sse } from '@nestjs/common';
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
}
