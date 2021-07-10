import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { FileProviderFactory } from './file-provider.factory';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssignmentJpgRepository, AssignmentPdfRepository } from './assignment';
import { VideoRepository } from './video';
import { ReceiptRepository } from './receipt';
import { ReportJpgRepository, ReportPdfRepository } from './report';
import { CircularRepository } from './circular';
import { BillRepository } from './bill';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AssignmentJpgRepository,
      AssignmentPdfRepository,
      VideoRepository,
      ReceiptRepository,
      ReportJpgRepository,
      ReportPdfRepository,
      CircularRepository,
      BillRepository,
    ]),
    AuthModule,
  ],
  providers: [FilesService, FileProviderFactory],
  controllers: [FilesController],
})
export class FilesModule {
}
