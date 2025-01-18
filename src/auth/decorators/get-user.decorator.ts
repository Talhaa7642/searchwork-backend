import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    
    if (!request.user) {
    console.log(request.user, '=============not logged in==============');

      return undefined;
    }
    console.log(request.user, '===========================');
    return data ? request.user[data] : request.user;
  },
);
