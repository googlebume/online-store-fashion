import { fileDataType, FileHandlerBaseInterface } from "src/utils/interfaces/file-handler.interface";
import fs from "fs/promises";
import { constants as fsConstants } from "fs";
import * as pathsys from "path";

export class BaseFileHandler implements FileHandlerBaseInterface {
    constructor() { }

    async parsePath(paths: string): Promise<pathsys.ParsedPath> {
        const parsedPath = pathsys.parse(paths);
        return parsedPath;
    }

    async read(path: string): Promise<Buffer | false> {
        const exists = await this.exists(path, fsConstants.F_OK)
        if (!exists) return false
        try {
            const file = await fs.readFile(path);
            return file
        } catch (error) {
            throw new Error(`Error reading file at ${path}: ${error}`);
        }
    }
    async create(
        path: string,
        data: fileDataType,
        name?: string
    ): Promise<boolean> {

        const exists = await this.exists(path, fsConstants.F_OK)
        if (!exists) return false;

        let fileName: string;
        if (name) {
            fileName = name;
        } else {
            fileName = 'generate_hash'; // generate the hash
        }

        const filePath = pathsys.join(path, fileName);

        const buffer = Buffer.isBuffer(data) ? data : (data as Express.Multer.File).buffer;

        try {
            await fs.writeFile(filePath, buffer);
            return true;
        } catch (error) {
            throw new Error(`Error writing file at ${filePath}: ${error}`);
        }

    }
    async delete(path: string): Promise<boolean> {
        const exists = await this.exists(path, fsConstants.F_OK);
        if (!exists) return false;
        try {
            await fs.rm(path, { recursive: true, force: true });
            return true;
        } catch (error) {
            throw new Error(`Error deleting file at ${path}: ${error}`);
        }
    }

    async exists(path: string, mode: number = fsConstants.F_OK): Promise<boolean> {
        try {
            await fs.access(path, mode);
            return true;
        } catch (error) {
            console.error(`File at ${path} does not exist or is not accessible: ${error}`);
            return false;
        }
    }
}