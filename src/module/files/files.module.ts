import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { FileProviderFactory } from './file-provider.factory';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssignmentRepository } from './assignment';
import { VideoRepository } from './video';
import { ReceiptRepository } from './receipt';
import { ReportRepository } from './report';
import { CircularRepository } from './circular';
import { BillRepository } from './bill';
import { FileHistoryRepository } from './file-history.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AssignmentRepository,
      VideoRepository,
      ReceiptRepository,
      ReportRepository,
      CircularRepository,
      BillRepository,
      FileHistoryRepository,
    ]),
    AuthModule,
  ],
  providers: [FilesService, FileProviderFactory],
  controllers: [FilesController],
})
export class FilesModule {
}
