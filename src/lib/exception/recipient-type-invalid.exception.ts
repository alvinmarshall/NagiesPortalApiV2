import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode } from '../common/error-code';

export class AttendanceTypeInvalidException extends HttpException {
  constructor(message?: string) {
    super({
      message: message || 'Invalid recipient type',
      code: ErrorCode.RECIPIENT_TYPE_UNKNOWN,
    }, HttpStatus.BAD_REQUEST);
  }


}