import { BaseRepository } from 'typeorm-transactional-cls-hooked';
import { ReportEntity } from '../../../entities';
import { EntityRepository } from 'typeorm';

@EntityRepository(ReportEntity)
export class ReportRepository extends BaseRepository<ReportEntity> {

}