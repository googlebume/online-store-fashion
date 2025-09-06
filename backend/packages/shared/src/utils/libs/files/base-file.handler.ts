import { fileDataType, FileHandlerBaseInterface } from "src/utils/interfaces/file-handler.interface";
import * as fs from "fs/promises";
import { constants as fsConstants } from "fs";
import * as pathsys from "path";
import { HashCryptoHandler } from "../crypto/hash-crypto.handler";
import { Injectable } from "@nestjs/common";
import { error } from "console";

@Injectable()
export class BaseFileHandler implements FileHandlerBaseInterface {
    constructor(
        readonly hashHandler: HashCryptoHandler
    ) { }

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
        filePath: string,
        fileName: string,
        data: Buffer,

    ): Promise<{ success: boolean; filePath: string }> {

        const fullPaths = pathsys.join(filePath, fileName)
        console.log(`\n\n\n fullPaths file handler : ${fullPaths} \n\n\n`)
        console.log(data)

        // const dirExists = await this.exists(filePath, fsConstants.W_OK);
        // if (!dirExists) {
        //     throw new Error('Директорія не створена або обмежені права доступу');
        // }

        try {
            await fs.writeFile(fullPaths, data);
            return { success: true, filePath: fullPaths };
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