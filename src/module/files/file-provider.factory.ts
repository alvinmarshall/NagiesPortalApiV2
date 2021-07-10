import { FileType } from '../../lib/common';
import { FileBill } from './bill/file.bill';
import { FileReceipt } from './receipt/file.receipt';
import { FileReport } from './report/file.report';
import { Injectable } from '@nestjs/common';
import { FileAssignment } from './assignment/file.assignment';
import { FileCircular } from './circular/file.circular';
import { FileVideo } from './video/file.video';

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

  async uploadFile(fileType: FileType) {
    return this.actions[fileType]().uploadFile();
  }

  async downloadFile(fileType: FileType) {
    return this.actions[fileType]().downloadFile();
  }
}