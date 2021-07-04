import { InjectRepository } from '@nestjs/typeorm';
import { StudentRepository } from './student.repository';

class StudentService {
  constructor(
    @InjectRepository(StudentRepository)
    private readonly studentRepository: StudentRepository) {
  }

  getStudents(refs: string[]){
    this.studentRepository.findByIds(refs)
  }
}