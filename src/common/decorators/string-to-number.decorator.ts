import { Transform } from 'class-transformer';

export const StringToNumber = (): PropertyDecorator => {
  return Transform((params): any => {
    const { value } = params;
    return Number(value);
  });
};

export const StringToNumberArray = (): PropertyDecorator => {
  return Transform((params): any => {
    const { value } = params;
    if (value instanceof Array)
      return value.map((val) => parseInt(<string>val, 10));
    return [Number(<string>value)];
  });
};
