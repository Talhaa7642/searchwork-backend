import { HttpException, HttpStatus } from '@nestjs/common';

export class DuplicateJobPostException extends HttpException {
  constructor() {
    super('You already have a job post with the same title and status "hiring"', HttpStatus.BAD_REQUEST);
  }
}
