import bcrypt from "bcrypt";
import { HashHandlerInterface } from "src/utils/interfaces/crypto-handler.interface";
import { UtilsCryptoHandler } from "./utils-crypto.handler";

export class HashCryptoHandler implements HashHandlerInterface {
    constructor(
        private readonly bcrypt: bcrypt,
        private readonly cryptoUtils: UtilsCryptoHandler
    ){}

    async hash(data: string, salt: string): Promise<string>
    async hash(data: string, saltLength: number): Promise<string>

    async hash(data: string, saltOrLength: string | number): Promise<string> {
        if (typeof saltOrLength === 'string') {
            return await this.bcrypt.hash(data, saltOrLength);
        } else {
            const salt = await this.cryptoUtils.generateSalt(saltOrLength);
            return await this.bcrypt.hash(data, salt);
        }
    }

    async compare(input: string, hashed: string): Promise<boolean> {
        return await this.bcrypt.compare(input, hashed);
    }
}