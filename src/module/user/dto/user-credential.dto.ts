import { AuthType } from '../../../lib/common';

export class UserCredentialDto {
  username: string;
  password: string;
  role: AuthType;
}

export class RoleQuery {
  role: AuthType;
}