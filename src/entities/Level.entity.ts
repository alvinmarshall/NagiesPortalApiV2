import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("level", { schema: "nagies" })
export class LevelEntity {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "Level_No", length: 11 })
  levelNo: string;

  @Column("varchar", { name: "Level_Name", length: 30 })
  levelName: string;
}
