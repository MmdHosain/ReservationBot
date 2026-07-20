import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { OrganizationMember } from "./OrganizationMember.ts";

@Entity("organizations")
export class Organization {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column({ default: 'UTC' })
  timezone!: string;

  @Column({ type: 'timestamp', nullable: true })
  subscription_expires_at!: Date | null;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @OneToMany(() => OrganizationMember, member => member.organization)
  members!: OrganizationMember[];
}
