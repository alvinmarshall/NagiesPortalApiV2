import { FileSaveDto } from '../../lib';

export abstract class FileProvider {
  abstract uploadFile(file: FileSaveDto): Promise<any>

  abstract downloadFile(): Promise<any>

  protected fileSupport(mimetype: string) {
    switch (mimetype) {
      case 'image/jpeg':
      case 'image/png':
      case 'application/pdf':
        return true;
      default:
        return false;
    }
  }
}