import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("videos", { schema: "nagies" })
export class VideosEntity {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "Recipient", nullable: true, length: 255 })
  recipient: string | null;

  @Column("varchar", { name: "Sender_ID", nullable: true, length: 255 })
  senderId: string | null;

  @Column("varchar", { name: "File", nullable: true, length: 255 })
  file: string | null;

  @Column("datetime", {
    name: "Created_At",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date | null;
}
