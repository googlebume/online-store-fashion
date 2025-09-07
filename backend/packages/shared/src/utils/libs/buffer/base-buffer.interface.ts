import { Injectable } from "@nestjs/common";
import { BaseBufferInterface } from "src/utils/interfaces/buffer-handler.interface";

@Injectable()
class BaseBufferHandler implements BaseBufferInterface {
    constructor(){}

    isBuffer(buffer: any): buffer is Buffer {
        return Buffer.isBuffer(buffer)
    }

    length(buffer: Buffer): number {
        return buffer.length
    }
}

export default  BaseBufferHandler