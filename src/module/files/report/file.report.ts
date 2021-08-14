import { FileProvider } from '../file.provider';
import { FileSaveDto, FileType, saveBufferFile, UnsupportedFileTypeException, UploadDirectory } from '../../../lib';
import { UploadFile } from '../file.interface';
import { ReferenceNotFoundException } from '../../../lib/exception/reference-not-found.exception';

export class FileReport extends FileProvider {
  downloadFile(): Promise<any> {
    return Promise.resolve('downloading file');
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