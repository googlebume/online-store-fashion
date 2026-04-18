export class GetProductByIdQuery {
  constructor(readonly id: string, readonly withAttributes: boolean = false) {}
}
