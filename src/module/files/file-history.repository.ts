import { BaseRepository } from 'typeorm-transactional-cls-hooked';
import { UploadHistoryEntity } from '../../entities';
import { EntityRepository } from 'typeorm';

@EntityRepository(UploadHistoryEntity)
export class FileHistoryRepository extends BaseRepository<UploadHistoryEntity> {

}