// src/features/admin/services/admin.service.ts
import { AppDataSource } from "../../../db/orm.config.ts";
import { User } from "../../../db/entities/User.ts";
import { Organization } from "../../../db/entities/Organization.ts";
import { Event } from "../../../db/entities/Event.ts";
import { EventType } from "../../../db/entities/EventType.ts";

export const getBotStats = async () => {
  const userRepo = AppDataSource.getRepository(User);
  const orgRepo = AppDataSource.getRepository(Organization);
  const eventRepo = AppDataSource.getRepository(Event);
  const typeRepo = AppDataSource.getRepository(EventType);

  const total_users = await userRepo.count();
  const total_salons = await orgRepo.count();
  const total_appointments = await eventRepo.count();
  const total_services = await typeRepo.count();

  return { total_users, total_salons, total_appointments, total_services };
};
