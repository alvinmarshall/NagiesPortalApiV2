import { BadRequestException, Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { AttendanceQuery, CreateAttendanceDto } from './attendance.dto';
import { RoleQuery } from '../user/dto/user-credential.dto';
import { ErrorCode } from '../../lib/common/error-code';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/decorator';
import { UserDetails } from '../auth/interface';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {
  }

  @Post()
  async studentsAttendance(@Query() query: AttendanceQuery, @Body() dto: CreateAttendanceDto) {
    if (!query.attendanceType) throw new BadRequestException({
      message: 'provide attendance type query parameter',
      code: ErrorCode.USER_ROLE_UNKNOWN,
    });
    return this.attendanceService.createAttendance(dto, query.attendanceType);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getUserAttendance(@GetUser() user: UserDetails) {
    return this.attendanceService.getAttendanceByRefNumber(user.ref);
  }

}
