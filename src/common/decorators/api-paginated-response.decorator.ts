import { applyDecorators, Type } from '@nestjs/common';
import { ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

import { PaginatedResponse } from '../base/base.dto';

export const ApiPaginatedResponse = <T extends Type>(model: T): any => {
  return applyDecorators(
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(PaginatedResponse) },
          {
            properties: {
              records: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
            },
          },
        ],
      },
    }),
  );
};
