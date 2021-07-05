import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("evalsetup", { schema: "nagies" })
export class EvalsetupEntity {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "EV_No", length: 11 })
  evNo: string;

  @Column("varchar", { name: "Teachers_Name", length: 70 })
  teachersName: string;

  @Column("varchar", { name: "Faculty_Name", length: 70 })
  facultyName: string;

  @Column("varchar", { name: "Level_Name", length: 30 })
  levelName: string;

  @Column("varchar", { name: "Semester_Name", length: 30 })
  semesterName: string;

  @Column("varchar", { name: "Module_Name", length: 70 })
  moduleName: string;

  @Column("int", { name: "Temp_No" })
  tempNo: number;
}
