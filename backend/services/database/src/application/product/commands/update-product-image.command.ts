export class UpdateProductImageCommand {
  constructor(
    readonly productId: string,
    readonly file: Express.Multer.File,
  ) {}
}
