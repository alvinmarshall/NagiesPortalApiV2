import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileTypeQuery } from './dto/file.dto';
import { GetUser } from '../auth/decorator';
import { UserDetails } from '../auth/interface';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileSaveDto, FileType } from '../../lib';
import { FilesService } from './files.service';
import * as fs from 'fs';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/upload-file')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @GetUser() user: UserDetails,
    @Query() fileQuery: FileTypeQuery,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const fileDto: FileSaveDto = file;
    fileDto.other = {
      ref: fileQuery.ref, refName: fileQuery.refName,
    };
    return this.filesService.uploadFile(user, fileQuery.type, fileDto);
  }

  @Get('/download/:filename')
  async getDownload(@Res() res, @Query() fileQuery: FileTypeQuery, @Param('filename') filename: string) {
    const file = await this.filesService.downloadFile(fileQuery.type, filename);
    return res.download(file);
  }

  //stream video content if supported
  @Get('/video/:filename')
  async getVideo(@Res() res, @Req() req, @Param('filename') filename: string) {
    const videoPath = await this.filesService.downloadFile(FileType.VIDEO, filename);
    const videoStat = fs.statSync(videoPath);
    const fileSize = videoStat.size;
    const videoRange = req.headers.range;
    if (videoRange) {
      const parts = videoRange.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunkSize = (end - start) + 1;
      const file = fs.createReadStream(videoPath, { start, end });
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': 'video/mp4',
      };
      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      };
      res.writeHead(200, head);
      fs.createReadStream(videoPath).pipe(res);
    }
  }
}
