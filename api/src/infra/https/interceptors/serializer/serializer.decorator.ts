import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { ClassConstructor } from 'class-transformer';

import { SerializerInterceptor } from './serializer.interceptor';

export const Serializer = (useClass: ClassConstructor<unknown>) => {
  return applyDecorators(UseInterceptors(new SerializerInterceptor(useClass)));
};
