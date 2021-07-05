import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("receipt", { schema: "nagies" })
export class ReceiptEntity {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "Ref_No", nullable: true, length: 255 })
  refNo: string | null;

  @Column("varchar", { name: "Name", nullable: true, length: 255 })
  name: string | null;

  @Column("varchar", { name: "Level", nullable: true, length: 255 })
  level: string | null;

  @Column("varchar", { name: "Image", nullable: true, length: 255 })
  image: string | null;

  @Column("datetime", { name: "Date", nullable: true })
  date: Date | null;
}
