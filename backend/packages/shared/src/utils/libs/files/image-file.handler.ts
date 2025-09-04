import { FormatImageFileInterface, ConvertImageFileImterface } from "src/utils/interfaces/file-handler.interface";
import { BaseFileHandler } from "./base-file.handler";
import { HashCryptoHandler } from "../crypto/hash-crypto.handler";
import mime from 'mime'

export class ImageFileHandler extends BaseFileHandler {
    constructor(
        hashHandler: HashCryptoHandler,
    ){
        super(hashHandler)
    }
    
    async saveImage(paths: string, file: Express.Multer.File){
        // const fileName = this.hashHandler.
    }
}

export class FormatImageFileHandler extends BaseFileHandler implements FormatImageFileInterface {
    constructor(
        hashHandler: HashCryptoHandler,
    ){
        super(hashHandler)
    }

    async getMimeType(fileName: string): Promise<string | null>{
        return await mime.getType(fileName)
    }

    async getExtname(mimeType: string){
        return await mime.getExtension(mimeType)
    }
}

export class ConvertImageFileHandler extends BaseFileHandler implements ConvertImageFileImterface {
    constructor(
        hashHandler: HashCryptoHandler
    ){
        super(hashHandler)
    }
}