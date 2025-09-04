import { ConvertImageFileImterface } from "src/utils/interfaces/file-handler.interface";
import { BaseFileHandler } from "./base-file.handler";
import { HashCryptoHandler } from "../crypto/hash-crypto.handler";

export class ConvertImageFileHandler extends BaseFileHandler implements ConvertImageFileImterface {
    constructor(
        hashHandler: HashCryptoHandler
    ){
        super(hashHandler)
    }
}