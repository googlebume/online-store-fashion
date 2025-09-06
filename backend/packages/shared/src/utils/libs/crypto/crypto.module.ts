import { Module } from '@nestjs/common';
import { HashCryptoHandler } from './hash-crypto.handler';
import { UtilsCryptoHandler } from './utils-crypto.handler';


@Module({
    providers: [
        HashCryptoHandler,
        UtilsCryptoHandler
    ],
    exports: [
        HashCryptoHandler,
        UtilsCryptoHandler
    ]
})
export class CryptoHandlerModule { }
