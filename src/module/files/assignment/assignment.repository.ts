import { EntityRepository } from 'typeorm';
import { AssignmentEntity } from '../../../entities';
import { BaseRepository } from 'typeorm-transactional-cls-hooked';

@EntityRepository(AssignmentEntity)
export class AssignmentRepository extends BaseRepository<AssignmentEntity> {

}