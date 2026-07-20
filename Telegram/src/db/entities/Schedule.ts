import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Organization } from "./Organization.ts";
import { User } from "./User.ts";

@Entity("schedules")
export class Schedule {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => Organization, { onDelete: "CASCADE" })
  @JoinColumn({ name: "organization_id" })
  organization!: Organization;

  @ManyToOne(() => User, { onDelete: "CASCADE", nullable: true })
  @JoinColumn({ name: "user_id" })  
  user!: User | null;

  @Column("varchar")
  name!: string;

  @Column("date")
  valid_from!: Date | string;

  @Column("date", { nullable: true })
  valid_until!: Date | string | null;
}
