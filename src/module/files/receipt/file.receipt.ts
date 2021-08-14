import { FileProvider } from '../file.provider';
import { FileSaveDto, FileType, saveBufferFile, UnsupportedFileTypeException, UploadDirectory } from '../../../lib';
import { UploadFile } from '../file.interface';

export class FileReceipt extends FileProvider {
  downloadFile(): Promise<any> {
    return Promise.resolve('downloading file');
  }

  async uploadFile(file: FileSaveDto): Promise<UploadFile> {
    file.path = UploadDirectory.RECEIPT;
    console.log(file);
    if (!this.fileSupport(file.mimetype)) throw new UnsupportedFileTypeException();

    const filePath = await saveBufferFile(file);
    const resp: UploadFile = {
      fileType: FileType.RECEIPT,
      filePath: filePath,
    };
    return Promise.resolve(resp);
  }
}