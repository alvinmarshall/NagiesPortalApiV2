import { FileProvider } from '../file.provider';
import {
  FileNotFoundException,
  FileSaveDto,
  FileType,
  saveBufferFile,
  UnsupportedFileTypeException,
  UploadDirectory,
} from '../../../lib';
import { UploadFile } from '../file.interface';

export class FileReceipt extends FileProvider {
  async downloadFile(filename: string): Promise<string> {
    const files = await this.getResource(filename);
    const dir = UploadDirectory.RECEIPT;
    // check if the file is in scope
    // we don't allow any file downloaded out of scope
    if (files.length) {
      for (let index in files) {
        if (files[index].includes(dir)) {
          return Promise.resolve(files[index]);
        }
      }

    }
    throw new FileNotFoundException();
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