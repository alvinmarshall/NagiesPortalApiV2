import { EntityRepository } from 'typeorm';
import { MessageEntity } from '../../entities';
import { BaseRepository } from 'typeorm-transactional-cls-hooked';

@EntityRepository(MessageEntity)
export class MessageRepository extends BaseRepository<MessageEntity> {
}