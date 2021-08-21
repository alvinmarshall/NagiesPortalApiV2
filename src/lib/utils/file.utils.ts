import * as fs from 'fs';

export interface FileSaveDto {
  originalname: string
  size: number
  mimetype: string
  buffer: Buffer
  encoding: string
  path?: string
  fieldname: string
  other?: {
    ref: string
    refName: string
  }

}

export const getUploadDir = (): string => {
  let uploadDir = process.env['UPLOAD_DIR'] || undefined;
  if (!uploadDir) {
    uploadDir = './uploads';
  }
  return uploadDir;
};

export const saveBufferFile = (file: FileSaveDto): Promise<any> => {
  return new Promise(((resolve, reject) => {
    try {
      const uploadDir = getUploadDir();
      fs.mkdirSync(`${uploadDir}/${file.path}`, { recursive: true });
      let path = `${uploadDir}/${file.path}/${file.originalname}`;
      let fileUrl = `${file.path}/${file.originalname}`;
      fs.open(path, 'w', function(err, fd) {
        if (err) {
          throw 'could not open file: ' + err;
        }

        // write the contents of the buffer, from position 0 to the end, to the file descriptor returned in opening our file
        fs.write(fd, file.buffer, 0, file.buffer.length, null, function(err) {
          if (err) throw 'error writing file: ' + err;
          fs.close(fd, function() {
            resolve(fileUrl);
          });
        });
      });
    } catch (e) {
      console.error(e);
      reject(e);
    }


  }));

};