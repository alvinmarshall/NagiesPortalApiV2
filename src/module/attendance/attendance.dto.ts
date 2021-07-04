import { AttendanceStatus, AttendanceType } from '../../lib/common';
import { IsArray, IsEnum, IsNumber, IsString, MinLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class AttendanceDto {
  @MinLength(2)
  reference_number: string;
  @IsEnum(AttendanceStatus)
  status: AttendanceStatus;
}

export class CreateAttendanceDto {
  @MinLength(1)
  level: string;
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttendanceDto)
  attendance_list: AttendanceDto[];
  @MinLength(1)
  reporter_id: string;

  @IsString()
  @MinLength(4)
  year: string;

  @IsNumber()
  semester_id: number;
}

export class AttendanceQuery {
  attendanceType: AttendanceType;
}