import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("umers", { schema: "nagies" })
export class UmersEntity {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "Contact", length: 33 })
  contact: string;
}
