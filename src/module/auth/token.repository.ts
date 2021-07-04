import { BaseRepository } from 'typeorm-transactional-cls-hooked';
import { EntityRepository } from 'typeorm';
import { TokenEntity } from '../../entities';

@EntityRepository(TokenEntity)
export class TokenRepository extends BaseRepository<TokenEntity> {
}