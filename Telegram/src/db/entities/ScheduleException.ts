import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Organization } from "./Organization.ts";
import { User } from "./User.ts";
import { Resource } from "./Resource.ts";

@Entity("schedule_exceptions")
export class ScheduleException {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => Organization, { onDelete: "CASCADE" })
  @JoinColumn({ name: "organization_id" })
  organization!: Organization;

  @ManyToOne(() => User, { onDelete: "CASCADE", nullable: true })
  @JoinColumn({ name: "user_id" })
  user!: User | null;

  @ManyToOne(() => Resource, { onDelete: "CASCADE", nullable: true })
  @JoinColumn({ name: "resource_id" })
  resource!: Resource | null;

  @Column("date")
  specific_date!: Date | string;

  @Column("boolean")
  is_available!: boolean;

  @Column("time", { nullable: true })
  start_time!: string | null;

  @Column("time", { nullable: true })
  end_time!: string | null;

  @Column("varchar", { nullable: true })
  reason!: string;
}
