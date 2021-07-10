import { BaseRepository } from 'typeorm-transactional-cls-hooked';
import { ReceiptEntity } from '../../../entities';
import { EntityRepository } from 'typeorm';

@EntityRepository(ReceiptEntity)
export class ReceiptRepository extends BaseRepository<ReceiptEntity> {

}