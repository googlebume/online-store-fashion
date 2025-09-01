import multer from "multer";
import path from "path";
import { type ParsedPath } from "path";
import type { Express } from "express";

export interface IFileHandlerBase {
    parsePath(paths: string): Promise<ParsedPath>;
    read(path: string): Promise<Buffer | false>;
    create(path: string, data: fileDataType, name?: string): Promise<boolean>;
    delete(path: string): Promise<boolean>;
    exists(path: string): Promise<boolean>;
}

export type fileDataType = Buffer | Express.Multer.File;