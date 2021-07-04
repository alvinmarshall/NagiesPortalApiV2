import { Expose } from 'class-transformer';

export class UserProfile {
  ref: string;
  name: string;
  gender: string;
  dob: string;
  admissionDate: string;
  @Expose({ groups: ['parent'] })
  section?: string;
  faculty: string;
  level: string;
  @Expose({ groups: ['parent'] })
  semester?: string;
  @Expose({ groups: ['parent'] })
  index?: string;
  @Expose({ groups: ['parent'] })
  guardian?: string;
  contact: string;
  imageUrl: string;
}

export class UserProfileDto {
  ref: string;
  name: string;
  gender: string;
  dob: string;
  admissionDate: string;
  section: string;
  faculty: string;
  level: string;
  @Expose({ groups: ['parent'] })
  semester?: string | undefined;
  @Expose({ groups: ['parent'] })
  index?: string | undefined;
  @Expose({ groups: ['parent'] })
  guardian?: string | undefined;
  contact: string;
  imageUrl: string;
}

