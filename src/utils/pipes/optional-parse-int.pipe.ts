import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class OptionalParseIntPipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: string, metadata: ArgumentMetadata) {
    if (value === undefined || value === '') {
      return undefined;
    }
    const val = parseInt(value, 10);
    if (isNaN(val)) {
      return undefined;
    }
    return val;
  }
}
