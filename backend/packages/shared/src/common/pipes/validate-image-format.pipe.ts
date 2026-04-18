import { Injectable, PipeTransform, BadRequestException, Optional } from '@nestjs/common';
import { ImageFileFormat, ImageFormatEnum } from '../../domain/image/value-objects/image-file-format.vo';
import { InvalidImageFormatException } from '../../domain/image/exceptions/image.exceptions';

@Injectable()
export class ValidateImageFormatPipe implements PipeTransform {
  private allowedFormats: ImageFormatEnum[] = [
    ImageFormatEnum.WEBP,
    ImageFormatEnum.JPEG,
    ImageFormatEnum.JPG,
    ImageFormatEnum.PNG,
  ];

  transform(file: Express.Multer.File): Express.Multer.File {
    if (!file) {
      return file;
    }

    try {
      const imageFormat = ImageFileFormat.create(file.mimetype);

      if (!this.allowedFormats.includes(imageFormat.value as ImageFormatEnum)) {
        throw new InvalidImageFormatException(
          file.mimetype,
          this.allowedFormats
        );
      }

      return file;
    } catch (error) {
      if (error instanceof InvalidImageFormatException) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('Invalid image file');
    }
  }
}
