import { EntityRepository, In } from 'typeorm';
import { StudentEntity } from '../../entities';
import { BaseRepository } from 'typeorm-transactional-cls-hooked';

@EntityRepository(StudentEntity)
export class StudentRepository extends BaseRepository<StudentEntity> {

  async findByRefs(refs: string[]): Promise<StudentEntity[]> {
    return this.find({ where: { studentsNo: In(refs) } });
  }

  async findByIndexNumber(indexNo: string): Promise<StudentEntity> {
    return this.findOne({ indexNo });
  }

  async findByReferenceNumber(referenceNo: string): Promise<StudentEntity> {
    return this.findOne({ studentsNo: referenceNo });
  }
}