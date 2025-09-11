import { Module } from '@nestjs/common';
import TimeIntervalsHandler from './time-intervals.handler';


@Module({
    providers: [
        TimeIntervalsHandler
    ],
    exports: [
        TimeIntervalsHandler
    ]
})
export class MimeHandlerModule { }