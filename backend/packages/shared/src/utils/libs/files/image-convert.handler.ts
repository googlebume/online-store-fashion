import { ConvertImageFileImterface } from "src/utils/interfaces/file-handler.interface";
import { BaseFileHandler } from "./base-file.handler";
import { HashCryptoHandler } from "../crypto/hash-crypto.handler";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ConvertImageFileHandler extends BaseFileHandler implements ConvertImageFileImterface {
    constructor(
        hashHandler: HashCryptoHandler
    ){
        super(hashHandler)
    }
}