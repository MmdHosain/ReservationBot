import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Event } from "./Event.ts";
import { UserV2 } from "./UserV2.ts";
import { ParticipantRole } from "../types.ts";

@Entity("event_participants")
export class EventParticipant {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => Event, { onDelete: "CASCADE" })
  @JoinColumn({ name: "event_id" })
  event!: Event;

  @ManyToOne(() => UserV2, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user!: UserV2;

  @Column({ type: "enum", enum: ParticipantRole })
  role!: ParticipantRole;
}
