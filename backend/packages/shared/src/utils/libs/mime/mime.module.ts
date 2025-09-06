import { Module } from '@nestjs/common';
import { MimeHandler } from './mime.handler';


@Module({
    providers: [
        MimeHandler
    ],
    exports: [
        MimeHandler
    ]
})
export class MimeHandlerModule { }
