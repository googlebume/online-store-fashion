export interface BaseBufferInterface {
    isBuffer(buffer: any): buffer is Buffer,
    length(buffer: Buffer): number,
}

export interface ConvertBufferInterface extends BaseBufferInterface {
    toBuffer(data: any): Promise<Buffer>,
    jsonTobuffer(json: JsonBufferType): Promise<Buffer>,
    fileToBuffer(file: Express.Multer.File): Promise<Buffer | null>
}

export type JsonBufferType = {
    type: 'Buffer', 
    data: Buffer
}

export interface readBufferInterface extends BaseBufferInterface {
    readAsString(buffer: Buffer, encoding: BufferEncoding): Promise<string>,
    readByte(buffer: Buffer, byte: number): Promise<{ code: number, symbol: string } | null>
    readBytes(buffer: Buffer, bytes: number[]): Promise<{string: string, readed: number[]} | null>
}