import { EntityRepository } from 'typeorm';
import { LevelEntity } from '../../entities';
import { BaseRepository } from 'typeorm-transactional-cls-hooked';

@EntityRepository(LevelEntity)
export class LevelRepository extends BaseRepository<LevelEntity> {

}