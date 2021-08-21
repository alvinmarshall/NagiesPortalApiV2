import { FileSaveDto, getUploadDir } from '../../lib';
import * as glob from 'glob';

export abstract class FileProvider {
  protected abstract uploadFile(file: FileSaveDto): Promise<any>

  protected abstract downloadFile(filename: string): Promise<any>

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

  protected getResource(filename: string): Promise<string[]> {
    return new Promise(((resolve, reject) => {
      const uploadDir = getUploadDir();
      glob(`${uploadDir}/**/${filename}`, function(err, files) {
        if (err) {
          reject(err);
        }
        resolve(files);
      });
    }));

  }
}