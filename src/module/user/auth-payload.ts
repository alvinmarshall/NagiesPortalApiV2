import { AuthType } from '../../lib/common';

export class AuthPayload{
  id: number;
  ref: string;
  level: string;
  role: AuthType;
  username: string;
  name: string;
  imageUrl: string;
  faculty: string;
  accessToken: string
  refreshToken: string

}