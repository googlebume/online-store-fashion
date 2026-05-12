import { BaseFileHandler } from "./base-file.handler";
import { HashCryptoHandler } from "../crypto/hash-crypto.handler";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ImageFileHandler extends BaseFileHandler {
    constructor(hashHandler: HashCryptoHandler){
        super(hashHandler)
    }

    async saveImage(paths: string, file: any){
        const rawBuffer: Buffer = Buffer.isBuffer(file.buffer)
            ? file.buffer
            : Buffer.from((file.buffer as { data: number[] }).data);

        let outputBuffer = rawBuffer;
        let ext = 'webp';

        try {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const sharp = require('sharp');
            outputBuffer = await sharp(rawBuffer).webp({ quality: 85 }).toBuffer();
        } catch (err) {
            console.error('[ImageFileHandler] sharp conversion failed, saving original:', (err as any)?.message);
            ext = (file.originalname?.split('.').pop() ?? 'bin').toLowerCase();
        }

        const fileName = await this.hashHandler.cryptoHash(outputBuffer, 10);
        const fullFileName = `${fileName}.${ext}`;

        try {
            const result = await this.create(paths, fullFileName, outputBuffer);
            return { success: result.success, filename: fullFileName };
        } catch(error){
            console.error(`[ImageFileHandler] Failed to save image: ${error}`);
            return { success: false };
        }
    }
}