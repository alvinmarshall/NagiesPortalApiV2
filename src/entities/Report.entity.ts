import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("report", { schema: "nagies" })
export class ReportEntity {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "Students_No", length: 11 })
  studentsNo: string;

  @Column("varchar", { name: "Students_Name", length: 70 })
  studentsName: string;

  @Column("varchar", { name: "Teachers_Email", length: 70 })
  teachersEmail: string;

  @Column("varchar", { name: "Report_File", length: 50 })
  reportFile: string;

  @Column("datetime", {
    name: "Report_Date",
    default: () => "CURRENT_TIMESTAMP",
  })
  reportDate: Date;
}
