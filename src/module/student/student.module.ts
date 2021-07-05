import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentRepository } from './student.repository';

@Module({
  imports:[TypeOrmModule.forFeature([StudentRepository])],
})
export class StudentModule {}
