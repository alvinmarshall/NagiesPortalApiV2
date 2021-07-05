import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("login", { schema: "nagies" })
export class LoginEntity {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "Fullname", length: 50 })
  fullname: string;

  @Column("varchar", { name: "Username", length: 20 })
  username: string;

  @Column("varchar", { name: "Password", length: 70 })
  password: string;

  @Column("int", { name: "Role" })
  role: number;
}
