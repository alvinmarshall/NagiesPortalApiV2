import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('upload_history', { schema: 'nagies' })
export class UploadHistoryEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;
  @Column('varchar', { name: 'owner_ref', nullable: true, length: 255 })
  ownerRef: string;
  @Column('varchar', { name: 'owner_type', nullable: true, length: 255 })
  ownerType: string;
  @Column('varchar', { name: 'target', nullable: true, length: 255 })
  target: string;
  @Column('varchar', { name: 'file_path', nullable: false, length: 255 })
  filePath: string;
  @Column('varchar', { name: 'mimetype', nullable: true, length: 255 })
  mimetype: string;
  @Column('varchar', { name: 'task_type', nullable: false, length: 255 })
  taskType: string;
  @Column('datetime', { name: 'Date', nullable: true, default: () => 'CURRENT_TIMESTAMP' })
  date: Date | null;

}
