import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { MessageType, RecipientType } from '../../../lib/common';

export interface MessageBody {
  message: string
  teacherName: string
  target_name: string
  target_id: string
}

export class CreateComplaint implements MessageBody {
  @IsString()
  @MinLength(2)
  message: string;
  @IsString()
  @MinLength(2)
  teacherName: string;
  target_id: string;
  target_name: string;
}

export class CreateMessage implements MessageBody {
  teacherName: string;
  @IsString()
  @MinLength(2)
  message: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  target_name: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  target_id: string;
}


export class RecipientQuery {
  @IsEnum(RecipientType)
  to: RecipientType;
}

export class MessageQuery {
  @IsEnum(MessageType)
  from: MessageType;
}