import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("billing", { schema: "nagies" })
export class BillingEntity {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "Students_No", length: 11 })
  studentsNo: string;

  @Column("varchar", { name: "Students_Name", length: 70 })
  studentsName: string;

  @Column("varchar", { name: "Uploader", length: 70 })
  uploader: string;

  @Column("varchar", { name: "Bill_File", length: 255 })
  billFile: string;

  @Column("datetime", {
    name: "Report_Date",
    default: () => "CURRENT_TIMESTAMP",
  })
  reportDate: Date;
}
