import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { UserV2 } from "./UserV2.ts";
import { EventType } from "./EventType.ts";

@Entity("user_event_types")
export class UserEventType {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => UserV2, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user!: UserV2;

  @ManyToOne(() => EventType, { onDelete: "CASCADE" })
  @JoinColumn({ name: "event_type_id" })
  event_type!: EventType;
}
