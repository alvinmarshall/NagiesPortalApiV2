import { FileProvider } from '../file.provider';
import { FileSaveDto, saveBufferFile, UnsupportedFileTypeException, UploadDirectory } from '../../../lib';

export class FileCircular extends FileProvider {
  downloadFile(): Promise<any> {
    return Promise.resolve('downloading file');
  }

  uploadFile(file: FileSaveDto): Promise<any> {
    file.path = UploadDirectory.CIRCULAR;
    console.log(file);
    if (!this.fileSupport(file.mimetype)) throw new UnsupportedFileTypeException();

    saveBufferFile(file);
    return Promise.resolve('uploading file');
  }
}