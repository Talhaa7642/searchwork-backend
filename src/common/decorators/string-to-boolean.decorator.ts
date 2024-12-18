import { Transform } from 'class-transformer';

export const StringToBoolean = (): PropertyDecorator => {
  return Transform((params): boolean => {
    const { value } = params;
    if (typeof value === 'string' || value instanceof String) {
      switch (value.toLowerCase().trim()) {
        case 'true':
        case 'yes':
        case '1':
          return true;

        default:
          return false;
      }
    }
    return value;
  });
};
