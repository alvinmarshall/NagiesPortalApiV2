import { BaseRepository } from 'typeorm-transactional-cls-hooked';
import { AssignmentImageEntity } from '../../../entities';
import { EntityRepository } from 'typeorm';

@EntityRepository(AssignmentImageEntity)
export class AssignmentJpgRepository extends BaseRepository<AssignmentImageEntity> {

}