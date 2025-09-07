import { readBufferInterface } from "src/utils/interfaces/buffer-handler.interface";
import BaseBufferHandler from "./base-buffer.interface";
import { Injectable } from "@nestjs/common";

@Injectable()
class ReadBufferHandler extends BaseBufferHandler implements readBufferInterface {
    constructor(
    ) {
        super()
    }
    async readAsString(buffer: Buffer, encoding: BufferEncoding = 'utf-8'): Promise<string> {
        return await buffer.toString(encoding)
    }

    async readByte(
        buffer: Buffer,
        byte: number,
        encoding: BufferEncoding = 'utf-8'
    ): Promise<{ code: number; symbol: string } | null> {
        if (byte < 0 || byte >= buffer.length) {
            return null;
        }

        const code = buffer[byte];
        const symbol = Buffer.from([code]).toString(encoding);

        return { code, symbol };
    }

    async readBytes(
        buffer: Buffer,
        bytes: number[],
        encoding: BufferEncoding = 'utf-8'
    ): Promise<{ string: string, readed: number[] } | null> {
        if ((buffer.length > 0 || bytes.length > 0) && (buffer.length >= 255 || bytes.length >= 255)) return null

        const readed = bytes.map((i) => buffer[i])

        return {
            string: await Buffer.from(readed).toString(encoding),
            readed: readed
        }
    }
}

export default ReadBufferHandler