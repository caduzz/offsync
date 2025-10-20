import { ForbiddenException } from "@nestjs/common";

export class ForbiddenError extends ForbiddenException {
  constructor(message: string, messageCode?: string) {
    super({
      message,
      statusCode: 400,
      messageCode: messageCode || 'FORBIDDEN_REQUEST',
    });
  }
}