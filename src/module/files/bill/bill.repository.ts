import { EntityRepository } from 'typeorm';
import { BillingEntity } from '../../../entities';
import { BaseRepository } from 'typeorm-transactional-cls-hooked';

@EntityRepository(BillingEntity)
export class BillRepository extends BaseRepository<BillingEntity> {

}