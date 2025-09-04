import { FormatImageFileInterface, ConvertImageFileImterface } from "src/utils/interfaces/file-handler.interface";
import { BaseFileHandler } from "./base-file.handler";
import { HashCryptoHandler } from "../crypto/hash-crypto.handler";
import * as mime from 'mime/lite'

export class FormatImageFileHandler extends BaseFileHandler implements FormatImageFileInterface {
    constructor(
        hashHandler: HashCryptoHandler,
    ){
        super(hashHandler)
    }
}

export class ConvertImageFileHandler extends BaseFileHandler implements ConvertImageFileImterface {
    constructor(
        hashHandler: HashCryptoHandler
    ){
        super(hashHandler)
    }
}