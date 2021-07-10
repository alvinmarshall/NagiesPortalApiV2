import { BaseRepository } from 'typeorm-transactional-cls-hooked';
import { VideosEntity } from '../../../entities';
import { EntityRepository } from 'typeorm';

@EntityRepository(VideosEntity)
export class VideoRepository extends BaseRepository<VideosEntity> {

}