import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Organization } from "./Organization.ts";

@Entity("resources")
export class Resource {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => Organization, { onDelete: "CASCADE" })
  @JoinColumn({ name: "organization_id" })
  organization!: Organization;

  @Column()
  name!: string;

  @Column({ nullable: true })
  resource_type!: string;

  @Column({ default: true })  
  is_active!: boolean;
}
