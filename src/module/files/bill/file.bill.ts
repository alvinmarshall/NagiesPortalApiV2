import { FileProvider } from '../file.provider';
import {
  FileNotFoundException,
  FileSaveDto,
  saveBufferFile,
  UnsupportedFileTypeException,
  UploadDirectory,
} from '../../../lib';

export class FileBill extends FileProvider {
  async downloadFile(filename: string): Promise<any> {
    const files = await this.getResource(filename);
    const dir = UploadDirectory.BILL;
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

  async uploadFile(file: FileSaveDto): Promise<any> {
    file.path = UploadDirectory.BILL;
    if (!this.fileSupport(file.mimetype)) throw new UnsupportedFileTypeException();

    const resp = await saveBufferFile(file);
    return Promise.resolve(resp);
  }

}