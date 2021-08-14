import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { AttendanceStatus, AttendanceType } from '../lib/common';

@Entity({ name: 'attendance', schema: 'nagies' })
export class AttendanceEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'reporter_id' })
  reporterId: string;
  @Column()
  level: string;

  @Column()
  year: string;

  @Column()
  semester_id: number;

  @Column({ name: 'attendance_type', type: 'enum', enum: AttendanceType })
  type: AttendanceType;

  @Column({ name: 'reference_no' })
  referenceNumber: string;

  @Column({
    type: 'enum',
    enum: AttendanceStatus,
    default: AttendanceStatus.ABSENT,
  })
  status: AttendanceStatus;

  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  modifiedAt: Date;

}