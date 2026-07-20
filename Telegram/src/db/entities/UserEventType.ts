import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User.ts";
import { EventType } from "./EventType.ts";

@Entity("user_event_types")
export class UserEventType {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user!: User;

  @ManyToOne(() => EventType, { onDelete: "CASCADE" })
  @JoinColumn({ name: "event_type_id" })
  event_type!: EventType;
}
