import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("teachers", { schema: "nagies" })
export class TeacherEntity {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "Teachers_No", length: 11 })
  teachersNo: string;

  @Column("varchar", { name: "Teachers_Name", length: 70 })
  teachersName: string;

  @Column("date", { name: "Dob" })
  dob: string;

  @Column("int", { name: "Age" })
  age: number;

  @Column("varchar", { name: "Gender", length: 10 })
  gender: string;

  @Column("varchar", { name: "Contact", length: 33 })
  contact: string;

  @Column("date", { name: "Admin_Date" })
  adminDate: string;

  @Column("varchar", { name: "Faculty_Name", length: 70 })
  facultyName: string;

  @Column("varchar", { name: "Level_Name", length: 30 })
  levelName: string;

  @Column("varchar", { name: "Username", length: 50 })
  username: string;

  @Column("varchar", { name: "Password", length: 70 })
  password: string;

  @Column("varchar", { name: "Image", length: 70 })
  image: string;
}
