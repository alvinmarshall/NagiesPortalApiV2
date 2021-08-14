import { AuthType } from '../../lib/common';

export interface UserDetails {
  id: number;
  ref: string;
  level: string;
  role: AuthType;
  username: string;
  name: string;
  imageUrl: string;
  faculty: string;
}

