import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode } from '../common/error-code';

export class ReferenceNotFoundException extends HttpException {
  constructor(message: string) {
    super({
      message,
      code: ErrorCode.REFERENCE_UNKNOWN,
    }, HttpStatus.BAD_REQUEST);
  }


}