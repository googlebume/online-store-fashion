import { UtilsHandlerInterface } from "src/utils/interfaces/crypto-handler.interface";
import bcrypt from 'bcrypt'

export class UtilsCryptoHandler implements UtilsHandlerInterface{
    constructor(
        private readonly bcrypt: bcrypt
    ){}

    async generateSalt(length: number = 10): Promise<string> {
        return await this.bcrypt.genSalt(length);
    }
}