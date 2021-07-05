import { Injectable } from '@nestjs/common';
import { UserDetailService } from '../auth/user-detail.service';
import { AuthType } from '../../lib/common';

@Injectable()
export class UserService {
  constructor(private readonly userDetailService: UserDetailService) {
  }

  async getProfile(referenceNo: string, role: AuthType) {
    return this.userDetailService.getUserProfile(referenceNo, role);
  }
}
