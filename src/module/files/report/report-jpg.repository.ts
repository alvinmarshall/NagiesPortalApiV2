import { EntityRepository } from 'typeorm';
import { ReportPngEntity } from '../../../entities';
import { BaseRepository } from 'typeorm-transactional-cls-hooked';

@EntityRepository(ReportPngEntity)
export class ReportJpgRepository extends BaseRepository<ReportPngEntity> {

}