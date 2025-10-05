import { Module } from '@nestjs/common';
import { MailerHandler } from './mailer.handler';

@Module({
    imports: [

    ],
    providers: [
        MailerHandler
    ],
    exports: [
        MailerHandler
    ]
})
export class MailerHandlerModule { }
