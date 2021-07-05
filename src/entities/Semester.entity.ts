import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("semester", { schema: "nagies" })
export class SemesterEntity {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "Semester_No", length: 11 })
  semesterNo: string;

  @Column("varchar", { name: "Semester_Name", length: 30 })
  semesterName: string;
}
