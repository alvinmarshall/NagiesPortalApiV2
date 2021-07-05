import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("student", { schema: "nagies" })
export class StudentEntity {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "Students_No", length: 11 })
  studentsNo: string;

  @Column("varchar", { name: "Students_Name", length: 100 })
  studentsName: string;

  @Column("date", { name: "Dob" })
  dob: string;

  @Column("varchar", { name: "Gender", length: 10 })
  gender: string;

  @Column("date", { name: "Admin_Date" })
  adminDate: string;

  @Column("int", { name: "Age" })
  age: number;

  @Column("varchar", { name: "Section_Name", length: 10 })
  sectionName: string;

  @Column("varchar", { name: "Faculty_Name", length: 70 })
  facultyName: string;

  @Column("varchar", { name: "Level_Name", length: 30 })
  levelName: string;

  @Column("varchar", { name: "Semester_Name", length: 30 })
  semesterName: string;

  @Column("varchar", { name: "Index_No", length: 20 })
  indexNo: string;

  @Column("varchar", { name: "Password", length: 30 })
  password: string;

  @Column("varchar", { name: "Guardian_Name", length: 70 })
  guardianName: string;

  @Column("varchar", { name: "Guardian_No", length: 33 })
  guardianNo: string;

  @Column("varchar", { name: "Image", length: 50 })
  image: string;
}
