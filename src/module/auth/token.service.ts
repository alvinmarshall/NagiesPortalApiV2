import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TokenRepository } from './token.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { StudentEntity, TeacherEntity, TokenEntity } from '../../entities';
import { JWTConfig } from '../../lib';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { TokenException } from '../../lib/exception';
import { ErrorCode } from '../../lib/common/error-code';
import { TokenExpiredError } from 'jsonwebtoken';
import { UserDetails } from './interface';
import { AuthType } from '../../lib/common';

export interface AccessTokenPayload {
  iat: number,
  exp: number,
  aud: string,
  iss: string,
  sub: string,
  role:AuthType
}

export interface RefreshTokenPayload {
  jti: string;
  sub: string
}

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(TokenRepository)
    private readonly tokenRepository: TokenRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
  }

  public async generateAccessToken(token: TokenEntity): Promise<string> {
    const { refresh, ...jwt } = this.configService.get<JWTConfig>('jwt');
    const opts: JwtSignOptions = {
      ...jwt,
      subject: token.userRef,
    };

    return this.jwtService.signAsync({role:token.role}, opts);
  }

  @Transactional()
  async createRefreshToken(token: TokenEntity, ttl: number = 60 * 60 * 1000): Promise<string> {
    const { refresh, ...jwt } = this.configService.get<JWTConfig>('jwt');
    const expiration = new Date();
    expiration.setTime(expiration.getTime() + ttl);
    token.expires = expiration;
    const tokenEntity = this.tokenRepository.create(token);
    const entity = await this.tokenRepository.save(tokenEntity);
    const opts: JwtSignOptions = {
      ...jwt,
      subject: token.userRef,
      jwtid: '' + entity.id,
    };
    return this.jwtService.signAsync({role:token.role}, opts);
  }


  async resolveRefreshToken(encoded: string): Promise<TokenEntity> {
    const payload = await this.decodeRefreshToken(encoded);
    const token = await this.getTokenById(payload);

    if (!token) {
      throw new TokenException('Refresh token not found');
    }

    if (token.is_revoked) {
      throw new TokenException('Refresh token revoked', ErrorCode.TOKEN_REVOKED);
    }
    return token;
  }

  public async createAccessTokenFromRefreshToken(refresh: string): Promise<{ token: string, userRef: string, role: AuthType }> {
    const entity = await this.resolveRefreshToken(refresh);
    const token = await this.generateAccessToken(entity);
    return { token, userRef: entity.userRef, role: entity.role };
  }

  private async decodeRefreshToken(token: string): Promise<any> {
    try {
      return this.jwtService.verifyAsync(token);
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        throw new TokenException('Refresh token expired',
          ErrorCode.TOKEN_EXPIRED);
      }
      throw new TokenException('Refresh token malformed',
        ErrorCode.TOKEN_MALFORMED);
    }
  }


  private async getTokenById(payload: RefreshTokenPayload): Promise<TokenEntity> {
    let tokenId = parseInt(payload.jti, 10) || 0;
    if (!tokenId) throw new TokenException('Refresh token malformed',
      ErrorCode.TOKEN_MALFORMED);
    return this.tokenRepository.findOne({ id: tokenId });
  }


}