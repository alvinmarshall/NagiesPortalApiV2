import { EntityRepository } from 'typeorm';
import { AssignmentEntity } from '../../../entities';
import { BaseRepository } from 'typeorm-transactional-cls-hooked';

@EntityRepository(AssignmentEntity)
export class AssignmentPdfRepository extends BaseRepository<AssignmentEntity> {

}