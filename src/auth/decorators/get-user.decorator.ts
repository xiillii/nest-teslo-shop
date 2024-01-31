import {
  ExecutionContext,
  InternalServerErrorException,
  createParamDecorator,
} from '@nestjs/common';
import { isArray } from 'class-validator';

export const GetUser = createParamDecorator((data, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  const user = req.user;

  if (!user) {
    throw new InternalServerErrorException('User not found (request)');
  }

  if (data) {
    if (isArray(data)) {
      const myUser = {};

      data.forEach((element) => {
        myUser[element] = user[element];
      });

      return myUser;
    }
    return user[data];
  }

  return user;
});
