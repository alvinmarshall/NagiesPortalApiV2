import { FileSaveDto, FileType } from '../../lib';
import { FileBill } from './bill';
import { FileReceipt } from './receipt';
import { FileReport } from './report';
import { Injectable } from '@nestjs/common';
import { FileAssignment } from './assignment';
import { FileCircular } from './circular';
import { FileVideo } from './video';
import { UploadFile } from './file.interface';

@Injectable()
export class FileProviderFactory {
  actions = {};

  constructor() {
    const fileBill = new FileBill();
    const fileReceipt = new FileReceipt();
    const fileReport = new FileReport();
    const fileAssignment = new FileAssignment();
    const fileCircular = new FileCircular();
    const fileVideo = new FileVideo();

    this.actions = {
      [FileType.BILL]: () => fileBill,
      [FileType.RECEIPT]: () => fileReceipt,
      [FileType.REPORT]: () => fileReport,
      [FileType.ASSIGNMENT]: () => fileAssignment,
      [FileType.CIRCULAR]: () => fileCircular,
      [FileType.VIDEO]: () => fileVideo,
    };
  }

  async uploadFile(fileType: FileType, file: FileSaveDto): Promise<UploadFile> {
    return this.actions[fileType]().uploadFile(file);
  }

  async downloadFile(fileType: FileType) {
    return this.actions[fileType]().downloadFile();
  }
}