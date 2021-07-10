import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentRepository } from './student.repository';
import { StudentService } from './student.service';

@Module({
  imports: [TypeOrmModule.forFeature([StudentRepository])],
  providers: [StudentService],
  exports: [StudentService],
})
export class StudentModule {
}
