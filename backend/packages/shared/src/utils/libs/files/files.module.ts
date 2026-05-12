import { Module } from '@nestjs/common';
import { BaseFileHandler } from './base-file.handler';
import { ImageFileHandler } from './image-file.handler';
import { TextFileHandler } from './text-file.handler';
import { ConvertImageFileHandler } from './image-convert.handler';
import { CryptoHandlerModule } from '../crypto/crypto.module';

@Module({
    imports: [
        CryptoHandlerModule,
    ],
    providers: [
        BaseFileHandler,
        ImageFileHandler,
        TextFileHandler,
        ConvertImageFileHandler
    ],
    exports: [
        BaseFileHandler,
        ImageFileHandler,
        TextFileHandler,
        ConvertImageFileHandler
    ]
})
export class FilesHandlerModule { }
