import { BadRequestException } from "@nestjs/common";

export class BadRequestError extends BadRequestException {
  constructor(message: string) {
    super({
      message,
      statusCode: 400,
      messageCode: 'BAD_REQUEST',
    });
  }
}