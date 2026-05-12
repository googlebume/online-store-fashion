import { BaseFileHandler } from "./base-file.handler";
import { HashCryptoHandler } from "../crypto/hash-crypto.handler";
import { Injectable } from "@nestjs/common";
import * as sharp from 'sharp';

@Injectable()
export class ImageFileHandler extends BaseFileHandler {
    constructor(hashHandler: HashCryptoHandler){
        super(hashHandler)
    }

    async saveImage(paths: string, file: any){
        const rawBuffer: Buffer = Buffer.isBuffer(file.buffer)
            ? file.buffer
            : Buffer.from((file.buffer as { data: number[] }).data);

        const webpBuffer = await sharp(rawBuffer).webp({ quality: 85 }).toBuffer();

        const fileName = await this.hashHandler.cryptoHash(webpBuffer, 10);
        const fullFileName = `${fileName}.webp`;

        try {
            const result = await this.create(paths, fullFileName, webpBuffer);
            return { success: result.success, filename: fullFileName };
        } catch(error){
            console.error(`[ImageFileHandler] Failed to save image: ${error}`);
            return { success: false };
        }
    }
}