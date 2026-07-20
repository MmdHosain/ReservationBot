import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from "typeorm";
import { OrganizationMember } from "./OrganizationMember.ts";

// Transformer to safely handle PostgreSQL bigint returned as strings in JS
const parseIntTransformer = {
  to: (value: any) => value,
  from: (value: any) => parseInt(value, 10)
};

@Entity("users_unified")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column("varchar")
  full_name!: string;

  @Column("varchar", { unique: true, nullable: true })
  email!: string;

  @Column("varchar", { nullable: true })
  phone!: string;

  @Column("bigint", { unique: true, nullable: true, transformer: parseIntTransformer })
  telegram_id!: number;

  @Column("varchar", { length: 100, unique: true, nullable: true })
  instagram_id!: string;

  @Column("varchar", { default: 'shamsi' })
  calendar_type!: string;

  @CreateDateColumn()
  created_at!: Date;

  @OneToMany(() => OrganizationMember, member => member.user)
  organization_members!: OrganizationMember[];
}
