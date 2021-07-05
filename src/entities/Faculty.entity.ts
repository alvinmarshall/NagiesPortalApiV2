import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("faculty", { schema: "nagies" })
export class FacultyEntity {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "Faculty_No", length: 11 })
  facultyNo: string;

  @Column("varchar", { name: "Faculty_Name", length: 100 })
  facultyName: string;
}
