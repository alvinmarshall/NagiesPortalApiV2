import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("complaints", { schema: "nagies" })
export class ComplaintsEntity {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "Students_No", length: 11 })
  studentsNo: string;

  @Column("varchar", { name: "Students_Name", length: 70 })
  studentsName: string;

  @Column("varchar", { name: "Level_Name", length: 30 })
  levelName: string;

  @Column("varchar", { name: "Guardian_Name", length: 70 })
  guardianName: string;

  @Column("varchar", { name: "Guardian_No", length: 33 })
  guardianNo: string;

  @Column("varchar", { name: "Teachers_Name", length: 70 })
  teachersName: string;

  @Column("mediumtext", { name: "Message" })
  message: string;

  @Column("datetime", {
    name: "Message_Date",
    default: () => "CURRENT_TIMESTAMP",
  })
  messageDate: Date;
}
