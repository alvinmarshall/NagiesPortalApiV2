import { BaseRepository } from 'typeorm-transactional-cls-hooked';
import { CircularEntity } from '../../../entities';
import { EntityRepository } from 'typeorm';

@EntityRepository(CircularEntity)
export class CircularRepository extends BaseRepository<CircularEntity> {

}