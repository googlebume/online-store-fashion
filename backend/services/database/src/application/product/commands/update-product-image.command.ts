export class UpdateProductImageCommand {
  constructor(
    readonly productId: string,
    readonly buffer: string,
    readonly mimetype: string,
    readonly originalname: string,
  ) {}
}
