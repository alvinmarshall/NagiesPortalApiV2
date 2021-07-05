import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("circular", { schema: "nagies" })
export class CircularEntity {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "CID", length: 255 })
  cid: string;

  @Column("varchar", { name: "Faculty_Name", length: 255 })
  facultyName: string;

  @Column("varchar", { name: "FileName", length: 255 })
  fileName: string;

  @Column("datetime", { name: "CID_Date", default: () => "CURRENT_TIMESTAMP" })
  cidDate: Date;
}
