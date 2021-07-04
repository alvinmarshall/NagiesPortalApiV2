import { InjectRepository } from '@nestjs/typeorm';
import { AttendanceEntity } from '../../entities';
import { AttendanceRepository } from './attendance.repository';
import { CreateAttendanceDto } from './attendance.dto';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { Injectable } from '@nestjs/common';
import { AttendanceType } from '../../lib/common';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(AttendanceRepository)
    private readonly attendanceRepository: AttendanceRepository,
  ) {
  }

  @Transactional()
  async createAttendance(attendanceDto: CreateAttendanceDto, attendanceType: AttendanceType) {

    const attendanceList = attendanceDto.attendance_list.map(value => {
      const attendanceEntity = new AttendanceEntity();
      attendanceEntity.status = value.status;
      attendanceEntity.reporterId = attendanceDto.reporter_id;
      attendanceEntity.level = attendanceDto.level;
      attendanceEntity.type = attendanceType;
      attendanceEntity.referenceNumber = value.reference_number;
      attendanceEntity.year = attendanceDto.year;
      attendanceEntity.semester_id = attendanceDto.semester_id;
      return attendanceEntity;
    });

    return this.attendanceRepository.save(attendanceList);
  }

  async getAttendanceByLevel(level: string) {
    return this.attendanceRepository.find({ level });
  }

  async getAttendanceByRefNumber(ref: string) {
    return this.attendanceRepository.find({ referenceNumber: ref });
  }


}