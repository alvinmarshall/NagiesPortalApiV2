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
import { ReferenceNotFoundException } from '../../../lib/exception/reference-not-found.exception';

export class FileReport extends FileProvider {
  async downloadFile(filename: string): Promise<string> {
    const files = await this.getResource(filename);
    const dir = UploadDirectory.REPORT;
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
    file.path = UploadDirectory.REPORT;
    console.log(file);
    if (!file.other) throw new Error('missing other info');
    if (!file.other.ref) throw new ReferenceNotFoundException('missing reference id');
    if (!file.other.refName) throw new ReferenceNotFoundException('missing reference name');
    if (!this.fileSupport(file.mimetype)) throw new UnsupportedFileTypeException();
    const filePath = await saveBufferFile(file);
    const resp: UploadFile = {
      filePath: filePath,
      fileType: FileType.REPORT,
      other: file.other,
    };
    return Promise.resolve(resp);
  }


}