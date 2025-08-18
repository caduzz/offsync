import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';

import {
  ClassConstructor,
  instanceToInstance,
  plainToInstance,
} from 'class-transformer';
import { map } from 'rxjs';

@Injectable()
export class SerializerInterceptor implements NestInterceptor {
  constructor(private useClass: ClassConstructor<unknown>) {}

  public intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      map((data) => {
        return instanceToInstance(plainToInstance(this.useClass, data), {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
