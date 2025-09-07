import { BaseFileHandler } from "./base-file.handler";
import { HashCryptoHandler } from "../crypto/hash-crypto.handler";
import { MimeHandler } from "../mime/mime.handler";
import * as path from "path";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ImageFileHandler extends BaseFileHandler {
    constructor(
        hashHandler: HashCryptoHandler,
        private readonly mime: MimeHandler
    ){
        super(hashHandler)
    }
    
    async saveImage(paths: string, file: Express.Multer.File){
        const buffer: Buffer = Buffer.isBuffer(file.buffer)
        ? file.buffer
        : Buffer.from((file.buffer as { data: number[] }).data);

        const fileName = await this.hashHandler.cryptoHash(buffer, 10);
        const fileExtName = await this.mime.getExtname(file.mimetype)

        const originName = await `${fileName}.${fileExtName}`
        try {
            const success = await (await this.create(paths, originName, buffer)).success
        return {
            success,
            filename: `${fileName}.${fileExtName}`
        }
        } catch(error){
            return false
        }
    }
}