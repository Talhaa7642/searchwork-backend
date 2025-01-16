import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    if (data) {
      return request.user[data];
    }
    console.log(request.user.id, '=========');
    console.log(typeof request.user.id, request.user.id); // Check if it's a number or string

    return request.user;
  },
);
