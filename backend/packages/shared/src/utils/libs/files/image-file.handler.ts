import { BaseFileHandler } from "./base-file.handler";
import { HashCryptoHandler } from "../crypto/hash-crypto.handler";
import { MimeHandler } from "../mime/mime.handler";
import path from "path";

export class ImageFileHandler extends BaseFileHandler {
    constructor(
        hashHandler: HashCryptoHandler,
        private readonly mime: MimeHandler
    ){
        super(hashHandler)
    }
    
    async saveImage(paths: string, file: Express.Multer.File){
        const fileName = await this.hashHandler.hash(file.buffer, 10);
        const fileExtName = await this.mime.getExtname(file.mimetype)
        const filePath = await path.resolve(paths, `${fileName}.${fileExtName}`)
        try {
        await this.create(filePath, file.buffer)
        return fileName
        } catch(error){
            return false
        }
    }
}