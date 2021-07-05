import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("section", { schema: "nagies" })
export class SectionEntity {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "Section_No", length: 11 })
  sectionNo: string;

  @Column("varchar", { name: "Section_Name", length: 20 })
  sectionName: string;
}
