import { Injectable } from '@nestjs/common';
import * as path from 'path';
import { ImageFileHandler } from '@packages/shared/utils/libs/files/image-file.handler';
import { IImageStorage, ImageSaveResult, FileData } from '../../../application/ports/image-storage.port';

@Injectable()
export class LocalImageStorageAdapter implements IImageStorage {
  constructor(private readonly imageFileHandler: ImageFileHandler) {}

  async saveImage(file: FileData, dir: string): Promise<ImageSaveResult> {
    try {
      console.log('[LocalImageStorageAdapter] saveImage called with dir:', dir);
      console.log('[LocalImageStorageAdapter] File buffer type:', typeof file.buffer, 'size:', file.buffer instanceof Buffer ? file.buffer.length : 'N/A');
      console.log('[LocalImageStorageAdapter] File mimetype:', file.mimetype);
      console.log('[LocalImageStorageAdapter] File originalname:', file.originalname);

      const saveData = await this.imageFileHandler.saveImage(dir, file);
      console.log('[LocalImageStorageAdapter] saveData result:', saveData);

      if (!saveData || !saveData.success) {
        return { success: false, error: 'Failed to save image' };
      }
      const imageBaseUrl = process.env.IMAGE_BASE_URL || 'http://localhost:5002';
      const url = `${imageBaseUrl}/products/${saveData.filename}`;
      console.log('[LocalImageStorageAdapter] Image saved successfully at:', url);
      return {
        success: true,
        filename: saveData.filename,
        url,
      };
    } catch (error) {
      console.error('[LocalImageStorageAdapter] Error:', error);
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
    newFile: FileData,
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
