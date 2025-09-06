export interface BaseBufferInterface {
    isBuffer(buffer: any): buffer is Buffer,
    length(buffer: Buffer): number,
}

export interface ConvertToBufferInterface extends BaseBufferInterface{
    
    toBuffer(data:any): Buffer,
    jsonTobuffer(json: {type: 'Buffer', data: Buffer}): Buffer,
    fileToBuffer(file: Express.Multer.File): Buffer
}

export interface readBuffer extends BaseBufferInterface{
    read(buffer: Buffer): string,
    readByte(buffer: Buffer, byte: number): {code: number, symbol: string} | null
    readBytes(buffer: Buffer, bytes: number[]): string | null
}