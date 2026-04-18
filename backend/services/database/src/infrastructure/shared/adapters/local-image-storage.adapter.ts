import { Injectable } from '@nestjs/common';
import * as path from 'path';
import { ImageFileHandler } from '@packages/shared/utils/libs/files/image-file.handler';
import { IImageStorage, ImageSaveResult } from '../../../application/ports/image-storage.port';

@Injectable()
export class LocalImageStorageAdapter implements IImageStorage {
  constructor(private readonly imageFileHandler: ImageFileHandler) {}

  async saveImage(file: Express.Multer.File, dir: string): Promise<ImageSaveResult> {
    try {
      const saveData = await this.imageFileHandler.saveImage(dir, file);
      if (!saveData || !saveData.success) {
        return { success: false, error: 'Failed to save image' };
      }
      const url = `/products/${saveData.filename}`;
      return {
        success: true,
        filename: saveData.filename,
        url,
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async deleteImage(filePath: string): Promise<boolean> {
    try {
      await this.imageFileHandler.delete(filePath);
      return true;
    } catch (error) {
      console.error(`Failed to delete image: ${error}`);
      return false;
    }
  }

  async updateImage(
    newFile: Express.Multer.File,
    oldFilePath: string,
    dir: string,
  ): Promise<ImageSaveResult> {
    try {
      if (oldFilePath) {
        await this.deleteImage(oldFilePath);
      }
      return this.saveImage(newFile, dir);
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
