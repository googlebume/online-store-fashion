export class InvalidImageFormatException extends Error {
  constructor(format: string, allowedFormats: string[]) {
    super(
      `Invalid image format: ${format}. Allowed formats: ${allowedFormats.join(', ')}`
    );
    this.name = 'InvalidImageFormatException';
  }
}

export class ImageFileSizeExceededException extends Error {
  constructor(size: number, maxSize: number) {
    super(
      `Image file size (${size} bytes) exceeds maximum allowed size (${maxSize} bytes)`
    );
    this.name = 'ImageFileSizeExceededException';
  }
}
