import { Injectable } from '@nestjs/common';
import { FileProviderFactory } from './file-provider.factory';
import { UserDetails } from '../auth/interface';
import { FileSaveDto, FileType } from '../../lib';
import { AssignmentRepository } from './assignment';
import { InjectRepository } from '@nestjs/typeorm';
import { AssignmentEntity, ReceiptEntity, ReportEntity, UploadHistoryEntity, VideosEntity } from '../../entities';
import { ReportRepository } from './report';
import { ReceiptRepository } from './receipt';
import { VideoRepository } from './video';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { FileHistoryRepository } from './file-history.repository';
import { FileHistory } from './file.interface';

@Injectable()
export class FilesService {
  constructor(
    private readonly fileProviderFactory: FileProviderFactory,
    @InjectRepository(AssignmentRepository)
    private readonly assignmentRepository: AssignmentRepository,
    @InjectRepository(ReportRepository)
    private readonly reportRepository: ReportRepository,
    @InjectRepository(ReceiptRepository)
    private readonly receiptRepository: ReceiptRepository,
    @InjectRepository(VideoRepository)
    private readonly videoRepository: VideoRepository,
    @InjectRepository(FileHistoryRepository)
    private readonly fileHistoryRepository: FileHistoryRepository,
  ) {
  }

  @Transactional()
  async uploadFile(user: UserDetails, fileType: FileType, fileDto: FileSaveDto) {
    const resp = await this.fileProviderFactory.uploadFile(fileType, fileDto);
    const history: FileHistory = {
      taskType: resp.fileType,
    };

    switch (resp.fileType) {
      case FileType.BILL:
        break;
      case FileType.CIRCULAR:
        break;
      case FileType.RECEIPT:
        const receiptEntity = new ReceiptEntity();
        receiptEntity.refNo = user.ref;
        receiptEntity.level = user.level;
        receiptEntity.name = user.name;
        receiptEntity.image = resp.filePath;
        await this.receiptRepository.save(receiptEntity);

        history.owner = user.ref;
        history.ownerType = user.role;
        history.filePath = resp.filePath;
        history.mimetype = fileDto.mimetype;
        history.target = user.level;
        await this.addUploadHistory(history);
        break;
      case FileType.ASSIGNMENT:
        const assignmentEntity = new AssignmentEntity();
        assignmentEntity.teachersEmail = user.username;
        assignmentEntity.studentsNo = user.level;
        assignmentEntity.studentsName = user.username;
        assignmentEntity.reportFile = resp.filePath;
        await this.assignmentRepository.save(assignmentEntity);

        history.owner = user.ref;
        history.ownerType = user.role;
        history.filePath = resp.filePath;
        history.mimetype = fileDto.mimetype;
        history.target = user.level;
        await this.addUploadHistory(history);
        break;
      case FileType.REPORT:

        const reportEntity = new ReportEntity();
        reportEntity.reportFile = resp.filePath;
        reportEntity.studentsNo = resp.other.ref;
        reportEntity.studentsName = resp.other.refName;
        reportEntity.teachersEmail = user.username;
        await this.reportRepository.save(reportEntity);

        history.owner = user.ref;
        history.ownerType = user.role;
        history.filePath = resp.filePath;
        history.mimetype = fileDto.mimetype;
        history.target = resp.other.ref;
        await this.addUploadHistory(history);
        break;
      case FileType.VIDEO:
        const videosEntity = new VideosEntity();
        videosEntity.file = resp.filePath;
        videosEntity.senderId = user.ref;
        videosEntity.recipient = user.level;
        await this.videoRepository.save(videosEntity);

        history.owner = user.ref;
        history.ownerType = user.role;
        history.filePath = resp.filePath;
        history.mimetype = fileDto.mimetype;
        history.target = user.level;
        await this.addUploadHistory(history);
        break;
    }
    return resp;
  }

  downloadFile(fileType: FileType) {
    return this.fileProviderFactory.downloadFile(fileType);
  }

  // noinspection DuplicatedCode
  private async addUploadHistory(history: FileHistory) {
    const entity = new UploadHistoryEntity();
    entity.filePath = history.filePath;
    entity.ownerRef = history.owner;
    entity.ownerType = history.ownerType;
    entity.target = history.target;
    entity.mimetype = history.mimetype;
    entity.taskType = history.taskType;
    await this.fileHistoryRepository.save(entity);
  }
}
