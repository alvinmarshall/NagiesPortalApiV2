import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { JWTConfig } from '../../lib';

@Injectable()
export class JwtOptionFactoryService implements JwtOptionsFactory {
  constructor(private readonly configService: ConfigService) {
  }

  createJwtOptions(): Promise<JwtModuleOptions> | JwtModuleOptions {
    const { secret, expiresIn, audience, issuer } =
      this.configService.get<JWTConfig>('jwt');
    return {
      secret,
      signOptions: {
        expiresIn, issuer, audience,
      },
    };
  }

}