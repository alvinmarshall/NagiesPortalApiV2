import { FileProvider } from '../file.provider';
import { FileSaveDto, FileType, saveBufferFile, UnsupportedFileTypeException, UploadDirectory } from '../../../lib';
import { UploadFile } from '../file.interface';

export class FileVideo extends FileProvider {
  downloadFile(): Promise<any> {
    return Promise.resolve('downloading file');
  }

  async uploadFile(file: FileSaveDto): Promise<UploadFile> {
    file.path = UploadDirectory.VIDEO;
    console.log(file);
    if (!this.fileSupport(file.mimetype)) throw new UnsupportedFileTypeException();
    const filePath = await saveBufferFile(file);
    const resp: UploadFile = {
      filePath: filePath,
      fileType: FileType.VIDEO,
    };
    return Promise.resolve(resp);
  }

  protected fileSupport(mimetype: string): boolean {
    switch (mimetype) {
      case 'video/mp4':
        return true;
      default:
        return false;
    }
  }

}