export class SaveProductImageCommand {
  constructor(
    readonly productId: string,
    readonly file: Express.Multer.File,
  ) {}
}
