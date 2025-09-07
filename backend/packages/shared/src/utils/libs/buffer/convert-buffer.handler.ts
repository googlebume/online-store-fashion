import { ConvertBufferInterface, JsonBufferType } from "src/utils/interfaces/buffer-handler.interface";
import BaseBufferHandler from "./base-buffer.interface";
import { Injectable } from "@nestjs/common";

@Injectable()
class ConvertBufferHandler extends BaseBufferHandler implements ConvertBufferInterface  {
    constructor(){
        super()
    }

    async toBuffer(data: any): Promise<Buffer> {
        return await Buffer.from(data)
    }

    async jsonTobuffer(json: JsonBufferType): Promise<Buffer> {
        return await Buffer.from((json as {data: Buffer}).data )
    }

    async fileToBuffer(file: Express.Multer.File & { buffer: Buffer | JsonBufferType }): Promise<Buffer | null> {
        const isBuffer = this.isBuffer(file.buffer)
        if (isBuffer) return await file.buffer
        else { return null}
    }
}

export default ConvertBufferHandler