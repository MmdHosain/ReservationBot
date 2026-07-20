import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { Organization } from "./Organization.ts";
import { EventType } from "./EventType.ts";

@Entity("categories")
export class Category {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => Organization, { onDelete: "CASCADE" })
  @JoinColumn({ name: "organization_id" })
  organization!: Organization;

  @Column("varchar")
  name!: string;

  @OneToMany(() => EventType, et => et.category)
  event_types!: EventType[];

  @CreateDateColumn()
  created_at!: Date;
}
