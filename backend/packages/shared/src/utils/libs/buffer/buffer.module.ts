import { Module } from '@nestjs/common';
import BaseBufferHandler from './base-buffer.interface';
import ReadBufferHandler from './read-buffer.handler';
import ConvertBufferHandler from './convert-buffer.handler';



@Module({
    providers: [
        BaseBufferHandler,
        ReadBufferHandler,
        ConvertBufferHandler,
    ],
    exports: [
        BaseBufferHandler,
        ReadBufferHandler,
        ConvertBufferHandler,
    ]
})
export class BufferHandlerModule { }
