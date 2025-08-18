import { InternalServerErrorException } from "@nestjs/common";

export class InternalServerError extends InternalServerErrorException {
  constructor(
    public readonly message: string,
    public readonly messageCode?: string,
    public readonly statusCode: number = 500,
  ) {
    super({
      statusCode,
      message,
      messageCode,
    });
  }
}
