import { Controller, Get, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileTypeQuery } from './dto/file.dto';
import { GetUser } from '../auth/decorator';
import { UserDetails } from '../auth/interface';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileSaveDto } from '../../lib';
import { FilesService } from './files.service';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/upload')
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

  @Get('/download')
  async getDownload(@Query() fileQuery: FileTypeQuery) {
    return this.filesService.downloadFile(fileQuery.type);
  }
}
