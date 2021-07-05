import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeacherRepository } from './teacher.repository';

@Module({
  imports:[TypeOrmModule.forFeature([TeacherRepository])],
})
export class TeacherModule {}
