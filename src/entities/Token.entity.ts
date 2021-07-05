import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { AuthType } from '../lib/common';

@Entity('token', { schema: 'nagies' })
export class TokenEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ default: false })
  is_revoked: boolean;

  @Column({ name: 'user_ref' })
  userRef: string;

  @Column({ name: 'role', type: 'enum', enum: AuthType })
  role: AuthType;


  @Column()
  expires: Date;


}