import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode } from '../common/error-code';

export class UnsupportedFileTypeException extends HttpException {
  constructor(message: string = 'file not supported') {
    super({
      message,
      code: ErrorCode.UNSUPPORTED_TYPE,
    }, HttpStatus.UNSUPPORTED_MEDIA_TYPE);
    this.name = this.constructor.name;
  }

}