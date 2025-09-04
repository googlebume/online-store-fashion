import multer from "multer";
import path from "path";
import { type ParsedPath } from "path";
import type { Express } from "express";

export interface FileHandlerBaseInterface {
    parsePath(paths: string): Promise<ParsedPath>;
    read(path: string): Promise<Buffer | false>;
    create(path: string, data: fileDataType, name?: string): Promise<string | boolean>;
    delete(path: string): Promise<boolean>;
    exists(path: string): Promise<boolean>;
}

export type fileDataType = Buffer | Express.Multer.File;

export interface TextFileHandlerInterface {
    readAsString(path: string, encoding?: BufferEncoding): Promise<string | false>;
    // appendString(path: string, data: string, encoding?: BufferEncoding): Promise<boolean>;
    // writeString(path: string, data: string, encoding?: BufferEncoding): Promise<boolean>;
    // clearFile(path: string): Promise<boolean>;
}

export interface FormatImageFileInterface {
    // checkFormatByPaths(paths: string): mime.TypeMap;
    // checkFormatByBuffer(buffer: Buffer): mime.TypeMap;
    // validateMime(): void;
}

export interface ConvertImageFileImterface {
    // getMetadata(buffer: Buffer): any;
    // resize(): any;
    // compress():any
}