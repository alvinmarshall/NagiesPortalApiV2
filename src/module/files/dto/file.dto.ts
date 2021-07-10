import { FileType } from '../../../lib/common';
import { IsEnum } from 'class-validator';

export class FileTypeQuery {
  @IsEnum(FileType)
  type: FileType;
}