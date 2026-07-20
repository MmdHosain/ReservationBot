import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Organization } from "./Organization.ts";

@Entity("event_types")
export class EventType {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => Organization, { onDelete: "CASCADE" })
  @JoinColumn({ name: "organization_id" })
  organization!: Organization;

  @Column("varchar")
  name!: string;

  @Column("int")
  duration_minutes!: number;

  @Column("int", { default: 0 })
  buffer_minutes!: number;

  @Column("boolean", { default: true })
  is_active!: boolean;
}
