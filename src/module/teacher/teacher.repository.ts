import { EntityRepository, In } from 'typeorm';
import { TeacherEntity } from '../../entities';
import { BaseRepository } from 'typeorm-transactional-cls-hooked';

@EntityRepository(TeacherEntity)
export class TeacherRepository extends BaseRepository<TeacherEntity> {

  async findByRefs(refs: string[]): Promise<TeacherEntity[]> {
    return this.find({ where: { teachersNo: In(refs) } });
  }

  async findByReferenceNumber(referenceNo: string): Promise<TeacherEntity> {
    return this.findOne({ teachersNo: referenceNo });
  }
}