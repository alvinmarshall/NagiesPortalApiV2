import { AuthType } from '../../lib/common';
import { Expose } from 'class-transformer';

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

