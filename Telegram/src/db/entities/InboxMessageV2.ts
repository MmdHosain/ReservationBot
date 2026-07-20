import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Organization } from "./Organization.ts";
import { User } from "./User.ts";

@Entity("inbox_messages_v2")
export class InboxMessageV2 {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => Organization, { onDelete: "CASCADE" })
  @JoinColumn({ name: "organization_id" })
  organization!: Organization;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "customer_id" })
  customer!: User;

  @Column("varchar")
  sender_name!: string;

  @Column("text")
  content!: string;

  @Column("varchar", { default: 'customer' })
  sender_type!: string;

  @Column("boolean", { default: false })
  is_read!: boolean;

  @CreateDateColumn()
  created_at!: Date;
}
