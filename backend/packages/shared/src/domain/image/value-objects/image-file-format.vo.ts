import { InvalidImageFormatException } from '../exceptions/image.exceptions';

export enum ImageFormatEnum {
  WEBP = 'webp',
  JPEG = 'jpeg',
  JPG = 'jpg',
  PNG = 'png',
}

export class ImageFileFormat {
  private static readonly ALLOWED_FORMATS = [
    ImageFormatEnum.WEBP,
    ImageFormatEnum.JPEG,
    ImageFormatEnum.JPG,
    ImageFormatEnum.PNG,
  ];

  private static readonly MIME_TYPES = {
    'image/webp': ImageFormatEnum.WEBP,
    'image/jpeg': ImageFormatEnum.JPEG,
    'image/jpg': ImageFormatEnum.JPG,
    'image/png': ImageFormatEnum.PNG,
  };

  private constructor(readonly value: ImageFormatEnum) {}

  static create(mimeType: string): ImageFileFormat {
    const format = this.MIME_TYPES[mimeType.toLowerCase()];

    if (!format) {
      throw new InvalidImageFormatException(
        mimeType,
        Object.keys(this.MIME_TYPES)
      );
    }

    return new ImageFileFormat(format);
  }

  static createFromExtension(extension: string): ImageFileFormat {
    const format = ImageFormatEnum[extension.toUpperCase() as keyof typeof ImageFormatEnum];

    if (!format || !this.ALLOWED_FORMATS.includes(format)) {
      throw new InvalidImageFormatException(
        extension,
        this.ALLOWED_FORMATS
      );
    }

    return new ImageFileFormat(format);
  }

  isWebP(): boolean {
    return this.value === ImageFormatEnum.WEBP;
  }

  equals(other: ImageFileFormat): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
