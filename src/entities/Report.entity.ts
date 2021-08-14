import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity("report", { schema: "nagies" })
export class ReportEntity {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column('varchar', { name: 'Students_No' })
  studentsNo: string;

  @Column('varchar', { name: 'Students_Name' })
  studentsName: string;

  @Column('varchar', { name: 'Teachers_Email' })
  teachersEmail: string;

  @Column('varchar', { name: 'Report_File' })
  reportFile: string;

  @Column("datetime", {
    name: "Report_Date",
    default: () => "CURRENT_TIMESTAMP",
  })
  reportDate: Date;
}
