export const IMAGE_STORAGE_PORT = Symbol('IImageStorage');

export interface ImageSaveResult {
  success: boolean;
  filename?: string;
  url?: string;
  error?: string;
}

export interface IImageStorage {
  saveImage(file: Express.Multer.File, dir: string): Promise<ImageSaveResult>;
  deleteImage(filePath: string): Promise<boolean>;
  updateImage(newFile: Express.Multer.File, oldFilePath: string, dir: string): Promise<ImageSaveResult>;
}
