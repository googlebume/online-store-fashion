export const IMAGE_STORAGE_PORT = Symbol('IImageStorage');

export interface ImageSaveResult {
  success: boolean;
  filename?: string;
  url?: string;
  error?: string;
}

export interface FileData {
  buffer: Buffer | string;
  mimetype: string;
  originalname: string;
}

export interface IImageStorage {
  saveImage(file: FileData, dir: string): Promise<ImageSaveResult>;
  deleteImage(filePath: string): Promise<boolean>;
  updateImage(newFile: FileData, oldFilePath: string, dir: string): Promise<ImageSaveResult>;
}
