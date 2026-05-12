import { Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ValidateWebpOnlyPipe {
  transform(file: Express.Multer.File): Express.Multer.File {
    if (!file) return file;
    if (!file.mimetype?.startsWith('image/')) {
      throw new BadRequestException('Only image files are allowed');
    }
    return file;
  }
}
