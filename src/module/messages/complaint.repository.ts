import { EntityRepository } from 'typeorm';
import { ComplaintsEntity } from '../../entities';
import { BaseRepository } from 'typeorm-transactional-cls-hooked';

@EntityRepository(ComplaintsEntity)
export class ComplaintRepository extends BaseRepository<ComplaintsEntity> {

}