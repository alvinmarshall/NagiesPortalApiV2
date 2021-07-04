import { EntityRepository } from 'typeorm';
import { AttendanceEntity } from '../../entities';
import { BaseRepository } from 'typeorm-transactional-cls-hooked';

@EntityRepository(AttendanceEntity)
export class AttendanceRepository extends BaseRepository<AttendanceEntity> {

}