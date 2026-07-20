import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Schedule } from "./Schedule.ts";

@Entity("schedule_rules")
export class ScheduleRule {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => Schedule, { onDelete: "CASCADE" })
  @JoinColumn({ name: "schedule_id" })
  schedule!: Schedule;

  @Column("int")
  day_of_week!: number;

  @Column("time")
  start_time!: string;

  @Column("time")
  end_time!: string;
}
