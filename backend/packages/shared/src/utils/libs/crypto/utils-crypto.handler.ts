import { UtilsHandlerInterface } from "src/utils/interfaces/crypto-handler.interface";
import * as bcrypt from 'bcrypt'
import { Injectable } from "@nestjs/common";

@Injectable()
export class UtilsCryptoHandler implements UtilsHandlerInterface{
    constructor(){}

    async generateSalt(length: number = 10): Promise<string> {
        return await bcrypt.genSalt(length);
    }
}