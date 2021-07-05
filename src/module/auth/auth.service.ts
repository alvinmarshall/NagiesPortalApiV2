import { Injectable } from '@nestjs/common';
import { UserDetailService } from './user-detail.service';
import { TokenService } from './token.service';
import { UserCredentialDto } from '../user/dto/user-credential.dto';
import { TokenEntity } from '../../entities';
import { UserNotFoundException } from '../../lib/exception';
import { AuthPayload } from '../user/auth-payload';

@Injectable()
export class AuthService {
  constructor(private readonly userDetailService: UserDetailService, private readonly tokenService: TokenService) {
  }

  async signIn(credential: UserCredentialDto): Promise<AuthPayload> {
    const token = new TokenEntity();
    const userDetails = await this.userDetailService.getUserByCredential(credential);
    if (!userDetails) throw new UserNotFoundException('credentials invalid');
    token.role = userDetails.role;
    token.userRef = userDetails.ref;

    const accessToken = await this.tokenService.generateAccessToken(token);
    const refreshToken = await this.tokenService.createRefreshToken(token);

    return { ...userDetails, accessToken, refreshToken };

  }
}
