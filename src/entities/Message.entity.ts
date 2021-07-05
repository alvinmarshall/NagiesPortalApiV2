import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("message", { schema: "nagies" })
export class MessageEntity {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "Message_BY", length: 50 })
  messageBy: string;

  @Column("datetime", { name: "M_Date", default: () => "CURRENT_TIMESTAMP" })
  mDate: Date;

  @Column("mediumtext", { name: "Message" })
  message: string;

  @Column("varchar", { name: "Message_Level", length: 33 })
  messageLevel: string;

  @Column("int", { name: "M_Read" })
  mRead: number;
}
