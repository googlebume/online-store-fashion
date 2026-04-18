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
    
    async saveImage(paths: string, file: any){
        console.log('[ImageFileHandler] saveImage called with paths:', paths);
        console.log('[ImageFileHandler] File object keys:', Object.keys(file));
        console.log('[ImageFileHandler] File mimetype:', file.mimetype);

        const buffer: Buffer = Buffer.isBuffer(file.buffer)
        ? file.buffer
        : Buffer.from((file.buffer as { data: number[] }).data);

        console.log('[ImageFileHandler] Buffer size:', buffer.length);

        const fileName = await this.hashHandler.cryptoHash(buffer, 10);
        console.log('[ImageFileHandler] Hash filename:', fileName);

        const fileExtName = await this.mime.getExtname(file.mimetype);
        console.log('[ImageFileHandler] File extension:', fileExtName);

        const fullFileName = `${fileName}.${fileExtName}`;
        console.log('[ImageFileHandler] Full filename:', fullFileName);

        try {
            const result = await this.create(paths, fullFileName, buffer);
            console.log('[ImageFileHandler] Create result:', result);
            return {
                success: result.success,
                filename: fullFileName
            };
        } catch(error){
            console.error(`[ImageFileHandler] Failed to save image: ${error}`);
            return { success: false };
        }
    }
}