import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("modules", { schema: "nagies" })
export class ModulesEntity {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "Module_No", length: 11 })
  moduleNo: string;

  @Column("varchar", { name: "Module_Name", length: 70 })
  moduleName: string;
}
