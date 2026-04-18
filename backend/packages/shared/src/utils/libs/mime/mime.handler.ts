import { MimeInterface } from "src/utils/interfaces/mime.interface"
import * as mimeTypes from 'mime-types'

export class MimeHandler implements MimeInterface {
    constructor(){}

    async getMimeType(fileName: string): Promise<string | false>{
        return mimeTypes.lookup(fileName)
    }

    async getExtname(mimeType: string){
        console.log('[MimeHandler] getExtname called with mimeType:', mimeType);
        const ext = mimeTypes.extension(mimeType);
        console.log('[MimeHandler] getExtname result:', ext);
        if (!ext) {
            console.warn('[MimeHandler] No extension found for mimetype:', mimeType);
            return 'unknown';
        }
        return ext;
    }
}