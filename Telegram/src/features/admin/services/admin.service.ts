// src/features/admin/services/admin.service.ts
import { AppDataSource } from "../../../db/orm.config.ts";
import { V1User, Service, Appointment } from "../../../db/entities/v1/index.ts";

export const getBotStats = async () => {
  const userRepo = AppDataSource.getRepository(V1User);
  const apptRepo = AppDataSource.getRepository(Appointment);
  const svcRepo = AppDataSource.getRepository(Service);

  const total_users = await userRepo.count();
  const total_salons = await userRepo.createQueryBuilder("u")
    .where("u.salon_name IS NOT NULL")
    .getCount();
  const total_appointments = await apptRepo.count();
  const total_services = await svcRepo.count();

  return { total_users, total_salons, total_appointments, total_services };
};
