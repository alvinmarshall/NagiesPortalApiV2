import { Controller, Post, Query, UseGuards } from '@nestjs/common';
import { FileTypeQuery } from './dto/file.dto';
import { FileProviderFactory } from './file-provider.factory';
import { GetUser } from '../auth/decorator';
import { UserDetails } from '../auth/interface';
import { AuthGuard } from '@nestjs/passport';

@Controller('files')
export class FilesController {
  constructor(private readonly fileProviderFactory: FileProviderFactory) {
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/upload')
  async uploadFile(@GetUser() user: UserDetails, @Query() fileQuery: FileTypeQuery) {
    return this.fileProviderFactory.uploadFile(fileQuery.type);
  }

  @Post('/download')
  async getDownload(@Query() fileQuery: FileTypeQuery) {
    return this.fileProviderFactory.downloadFile(fileQuery.type);
  }
}
