import { FileProvider } from '../file.provider';
import { FileSaveDto, saveBufferFile, UploadDirectory } from '../../../lib';
import { UnsupportedFileTypeException } from '../../../lib/exception/unsupported-file-type.exception';

export class FileBill extends FileProvider {
  downloadFile(): Promise<any> {
    return Promise.resolve('downloading file');
  }

  uploadFile(file: FileSaveDto): Promise<any> {
    file.path = UploadDirectory.BILL;
    console.log(file);
    if (!this.fileSupport(file.mimetype)) throw new UnsupportedFileTypeException();

    saveBufferFile(file);
    return Promise.resolve('uploading file');
  }

}