import { MimeInterface } from "src/utils/interfaces/mime.interface"
import mime from 'mime'

export class MimeHandler implements MimeInterface {
    constructor(){}

    async getMimeType(fileName: string): Promise<string | null>{
        return await mime.getType(fileName)
    }

    async getExtname(mimeType: string){
        return await mime.getExtension(mimeType)
    }
}