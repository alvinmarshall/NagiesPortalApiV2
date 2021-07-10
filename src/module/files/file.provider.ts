export abstract class FileProvider {
  abstract uploadFile(): Promise<any>

  abstract downloadFile(): Promise<any>
}