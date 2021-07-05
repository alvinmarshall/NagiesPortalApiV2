import { BadRequestException, Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { RoleQuery, UserCredentialDto } from './dto/user-credential.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserDetails } from '../auth/interface';
import { GetUser } from '../auth/decorator';
import { UserService } from './user.service';
import { classToPlain } from 'class-transformer';
import { ErrorCode } from '../../lib/common/error-code';

@Controller('users')
export class UserController {
  constructor(private readonly authService: AuthService, private readonly userService: UserService) {
  }

  @Post()
  signInWithCredential(@Query() query: RoleQuery, @Body() credential: UserCredentialDto) {
    if (!query) throw new BadRequestException({
      message: 'provide role query parameter',
      code: ErrorCode.USER_ROLE_UNKNOWN,
    });
    credential.role = query.role;
    return this.authService.signIn(credential);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/profile')
  async userProfile(@GetUser() user: UserDetails) {
    const profile = await this.userService.getProfile(user.ref, user.role);
    return classToPlain(profile, { groups: [user.role] });
  }
}
