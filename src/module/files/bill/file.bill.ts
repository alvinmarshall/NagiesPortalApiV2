import { FileProvider } from '../file.provider';

export class FileBill extends FileProvider {
  downloadFile(): Promise<any> {
    return Promise.resolve('downloading file');
  }

  uploadFile(): Promise<any> {
    return Promise.resolve('uploading file');
  }

}