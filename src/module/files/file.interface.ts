import { FileType } from '../../lib';

export interface UploadFile {
  filePath: string
  fileType: FileType
  other?: {
    ref: string
    refName: string
  }
}

export interface FileHistory {
  owner?: string
  ownerType?: string
  target?: string
  filePath?: string
  mimetype?: string
  taskType?: string
}