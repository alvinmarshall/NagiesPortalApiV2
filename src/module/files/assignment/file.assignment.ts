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

export class FileAssignment extends FileProvider {
  async downloadFile(filename: string): Promise<string> {
    const files = await this.getResource(filename);
    const dir = UploadDirectory.ASSIGNMENT;
    // check if the file is in scope
    // we don't any file downloaded
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