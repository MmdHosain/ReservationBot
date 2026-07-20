import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from "typeorm";
import { OrganizationMember } from "./OrganizationMember.ts";

@Entity("users_v2")
export class UserV2 {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  full_name!: string;

  @Column({ unique: true, nullable: true })
  email!: string;

  @Column({ nullable: true })
  phone!: string;

  @Column({ type: "bigint", unique: true, nullable: true })
  telegram_id!: number;

  @Column({ length: 100, unique: true, nullable: true })
  instagram_id!: string;

  @CreateDateColumn()
  created_at!: Date;

  @OneToMany(() => OrganizationMember, member => member.user)
  organization_members!: OrganizationMember[];
}
