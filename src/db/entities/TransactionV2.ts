import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Organization } from "./Organization.ts";
import { User } from "./User.ts";

@Entity("transactions_v2")
export class TransactionV2 {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => Organization, { onDelete: "CASCADE" })
  @JoinColumn({ name: "organization_id" })
  organization!: Organization;

  @ManyToOne(() => User, { onDelete: "SET NULL", nullable: true })
  @JoinColumn({ name: "user_id" })
  user!: User | null;

  @Column("int")
  amount!: number;

  @Column("int")
  package_days!: number;

  @Column("varchar")
  status!: string;

  @Column("varchar", { nullable: true })
  receipt_photo_id!: string;

  @Column("varchar", { nullable: true })
  authority!: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
