import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Organization } from "./Organization.ts";
import { UserV2 } from "./UserV2.ts";
import { UserOrgRole } from "../types.ts";

@Entity("organization_members")
export class OrganizationMember {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => Organization, org => org.members, { onDelete: "CASCADE" })
  @JoinColumn({ name: "organization_id" })
  organization!: Organization;

  @ManyToOne(() => UserV2, user => user.organization_members, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user!: UserV2;

  @Column({ type: "enum", enum: UserOrgRole })
  role!: UserOrgRole;

  @Column("boolean", { default: true })
  is_active!: boolean;
}
