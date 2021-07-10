import { InjectRepository } from '@nestjs/typeorm';
import { StudentRepository } from './student.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(StudentRepository)
    private readonly studentRepository: StudentRepository) {
  }

  getStudents(refs: string[]) {
    this.studentRepository.findByIds(refs);
  }

  getStudent(ref: string) {
    return this.studentRepository.findOne({ studentsNo: ref });
  }
}