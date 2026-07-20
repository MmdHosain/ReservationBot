import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Organization } from "./Organization.ts";
import { EventType } from "./EventType.ts";
import { BookingMode, EventStatus } from "../types.ts";

@Entity("events")
export class Event {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => Organization, { onDelete: "CASCADE" })
  @JoinColumn({ name: "organization_id" })
  organization!: Organization;

  @ManyToOne(() => EventType, { onDelete: "SET NULL", nullable: true })
  @JoinColumn({ name: "event_type_id" })
  event_type!: EventType | null;

  @Column("varchar", { nullable: true })
  title!: string;

  @Column("date")
  event_date!: Date | string;

  @Column({ type: "enum", enum: BookingMode, default: BookingMode.SCHEDULED })
  booking_mode!: BookingMode;

  @Column({ type: "enum", enum: EventStatus, default: EventStatus.PENDING })
  status!: EventStatus;

  @Column("timestamp", { nullable: true })
  planned_start_time!: Date | null;

  @Column("timestamp", { nullable: true })
  planned_end_time!: Date | null;

  @Column("int", { nullable: true })
  queue_number!: number | null;

  @Column("timestamp", { nullable: true })
  actual_start_time!: Date | null;

  @Column("timestamp", { nullable: true })
  actual_end_time!: Date | null;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
