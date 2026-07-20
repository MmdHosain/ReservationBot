import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from "typeorm";
import { OrganizationMember } from "./OrganizationMember.ts";

@Entity("users_v2")
export class UserV2 {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column("varchar")
  full_name!: string;

  @Column("varchar", { unique: true, nullable: true })
  email!: string;

  @Column("varchar", { nullable: true })
  phone!: string;

  @Column("bigint", { unique: true, nullable: true })
  telegram_id!: number;

  @Column("varchar", { length: 100, unique: true, nullable: true })
  instagram_id!: string;

  @CreateDateColumn()
  created_at!: Date;

  @OneToMany(() => OrganizationMember, member => member.user)
  organization_members!: OrganizationMember[];
}
