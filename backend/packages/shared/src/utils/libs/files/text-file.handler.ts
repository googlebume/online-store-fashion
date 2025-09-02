import { TextFileHandlerInterface } from "src/utils/interfaces/file-handler.interface";
import { BaseFileHandler } from "./base-file.handler";
import * as pathsys from "path";
import fs from "fs/promises";

export class TextFileHandler extends BaseFileHandler implements TextFileHandlerInterface {
    constructor() {
        super();
    }

    async readAsString(path: string, encoding: BufferEncoding = 'utf-8'): Promise<string | false> {
        const exists = this.exists(pathsys.resolve(path));
        if (!exists) return false;
        try {
            const file = await fs.readFile(path, { encoding })
            return file;

        } catch (error) {
            throw new Error(`Error reading file as string at ${path}: ${error}`);
        }
    }
}