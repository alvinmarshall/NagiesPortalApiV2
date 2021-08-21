import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode } from '../common/error-code';

export class FileNotFoundException extends HttpException {
  constructor(message: string = 'file not found') {
    super({
      message,
      code: ErrorCode.FILE_NOT_FOUND,
    }, HttpStatus.NOT_FOUND);
    this.name = this.constructor.name;
  }

}