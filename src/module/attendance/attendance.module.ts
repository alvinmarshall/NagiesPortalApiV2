import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendanceRepository } from './attendance.repository';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [
        AttendanceRepository,
      ],
    ),
    AuthModule,

  ],
  controllers: [AttendanceController],
  providers: [AttendanceService],
})
export class AttendanceModule {
}
