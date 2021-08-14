import { FileProvider } from '../file.provider';
import { FileSaveDto, FileType, saveBufferFile, UnsupportedFileTypeException, UploadDirectory } from '../../../lib';
import { UploadFile } from '../file.interface';

export class FileAssignment extends FileProvider {
  downloadFile(): Promise<any> {
    return Promise.resolve('downloading file');
  }

  async uploadFile(file: FileSaveDto): Promise<UploadFile> {
    file.path = UploadDirectory.ASSIGNMENT;
    console.log(file);
    if (!this.fileSupport(file.mimetype)) throw new UnsupportedFileTypeException();
    const savePath = await saveBufferFile(file);
    const resp: UploadFile = {
      filePath: savePath,
      fileType: FileType.ASSIGNMENT,
    };
    return Promise.resolve(resp);
  }

  protected fileSupport(mimetype: string): boolean {
    switch (mimetype) {
      case 'image/jpeg':
      case 'image/png':
      case 'text/csv':
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
      case 'application/pdf':
      case 'application/epub+zip':
      case 'text/plain':
        return true;
      default:
        return false;
    }
  }


}