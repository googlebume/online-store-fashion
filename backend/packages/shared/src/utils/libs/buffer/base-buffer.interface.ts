import { BaseBufferInterface } from "src/utils/interfaces/buffer-handler.interface";

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