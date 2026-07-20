import { Entity, ManyToOne, JoinColumn, PrimaryColumn } from "typeorm";
import { Event } from "./Event.ts";
import { Resource } from "./Resource.ts";

@Entity("event_resources")
export class EventResource {
  @PrimaryColumn("uuid")
  event_id!: string;

  @PrimaryColumn("uuid")
  resource_id!: string;

  @ManyToOne(() => Event, { onDelete: "CASCADE" })
  @JoinColumn({ name: "event_id" })
  event!: Event;

  @ManyToOne(() => Resource, { onDelete: "CASCADE" })
  @JoinColumn({ name: "resource_id" })
  resource!: Resource;
}
