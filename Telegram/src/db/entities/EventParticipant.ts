import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Event } from "./Event.ts";
import { User } from "./User.ts";
import { ParticipantRole } from "../types.ts";

@Entity("event_participants")
export class EventParticipant {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => Event, { onDelete: "CASCADE" })
  @JoinColumn({ name: "event_id" })
  event!: Event;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user!: User;

  @Column({ type: "enum", enum: ParticipantRole })
  role!: ParticipantRole;
}
