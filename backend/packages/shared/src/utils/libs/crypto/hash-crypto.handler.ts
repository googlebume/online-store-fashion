import * as bcrypt from "bcrypt";
import { HashHandlerInterface } from "src/utils/interfaces/crypto-handler.interface";
import { UtilsCryptoHandler } from "./utils-crypto.handler";
import { Injectable } from "@nestjs/common";
import * as crypto from 'crypto'

@Injectable()
export class HashCryptoHandler implements HashHandlerInterface {
    constructor(
        private readonly cryptoUtils: UtilsCryptoHandler
    ) { }

    // async hash(data: string | Buffer, salt: string): Promise<string>
    // async hash(data: string | Buffer, saltLength: number): Promise<string>

    async bcryptHash(data: string | Buffer, saltLength: number): Promise<string> {
        return await bcrypt.hash(data, saltLength);
    }
    async cryptoHash(data: string | Buffer, saltLength: number): Promise<string> {
        return await crypto.createHash('sha256').update(data).digest('hex');
    }

    async compare(input: string, hashed: string): Promise<boolean> {
        return await bcrypt.compare(input, hashed);
    }
}