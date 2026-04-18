import { MimeInterface } from "src/utils/interfaces/mime.interface"
import mimeTypes from 'mime-types'

export class MimeHandler implements MimeInterface {
    constructor(){}

    async getMimeType(fileName: string): Promise<string | false>{
        return mimeTypes.lookup(fileName)
    }

    async getExtname(mimeType: string){
        return mimeTypes.extension(mimeType)
    }
}