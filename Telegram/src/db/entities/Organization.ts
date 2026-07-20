import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { OrganizationMember } from "./OrganizationMember.ts";

@Entity("organizations")
export class Organization {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column("varchar")
  name!: string;

  @Column("varchar", { default: 'UTC' })
  timezone!: string;

  @Column("varchar", { default: 'beauty' }) 
  business_category!: string;

  @Column("int", { nullable: true }) 
  deposit_amount!: number | null;

  @Column("timestamp", { nullable: true })
  onboarded_at!: Date | null;

  @Column("timestamp", { nullable: true })
  subscription_expires_at!: Date | null;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @OneToMany(() => OrganizationMember, member => member.organization)
  members!: OrganizationMember[];
}
