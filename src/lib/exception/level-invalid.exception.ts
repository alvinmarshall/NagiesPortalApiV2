import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode } from '../common/error-code';

export class LevelInvalidException extends HttpException {
  constructor(message?: string) {
    super({
      message: message || "Level not found",
      code: ErrorCode.LEVEL_UNKNOWN,
    }, HttpStatus.BAD_REQUEST);
  }


}