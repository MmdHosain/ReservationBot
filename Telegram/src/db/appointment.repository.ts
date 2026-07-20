// src/db/appointment.repository.ts
import { AppDataSource } from "./orm.config.ts";
import { Appointment, Service, V1User, Staff } from "./entities/v1/index.ts";

const apptRepo = AppDataSource.getRepository(Appointment);
const svcRepo = AppDataSource.getRepository(Service);

export async function createAppointment(
  serviceId: number,
  customerTelegramId: number,
  customerName: string,
  appointmentDate: string,
  appointmentTime: string,
  staffId?: number,
  status: string = 'confirmed'
) {
  return await AppDataSource.transaction(async (manager) => {
    const service = await manager.findOneBy(Service, { id: serviceId });
    if (!service) throw new Error("SERVICE_NOT_FOUND");

    // Lock the salon owner row to serialize ALL bookings for this salon
    await manager.createQueryBuilder(V1User, "u")
      .setLock("pessimistic_write")
      .where("u.id = :id", { id: service.user_id })
      .getOne();

    let reqStart = 0;
    let reqEnd = 0;
    try {
      const [h, m] = appointmentTime.split(':').map(Number);
      reqStart = h * 60 + m;
      reqEnd = reqStart + service.duration;
    } catch(e) {
      throw new Error("INVALID_TIME_FORMAT");
    }

    const query = manager.createQueryBuilder(Appointment, "a")
      .innerJoin(Service, "s", "a.service_id = s.id")
      .select(["a.appointment_time", "s.duration"])
      .where("s.user_id = :userId", { userId: service.user_id })
      .andWhere("a.appointment_date = :date", { date: appointmentDate })
      .andWhere("a.status = 'confirmed'");

    if (staffId) {
      query.andWhere("a.staff_id = :staffId", { staffId });
    } else {
      query.andWhere("a.staff_id IS NULL");
    }

    const existingAppts = await query.getRawMany();

    for (const appt of existingAppts) {
      const timeStr = typeof appt.a_appointment_time === "string"
        ? appt.a_appointment_time
        : appt.a_appointment_time.toTimeString().substring(0, 5);
      const [ah, am] = timeStr.split(':').map(Number);
      const aStart = ah * 60 + am;
      const aEnd = aStart + appt.s_duration;

      if (
        (reqStart >= aStart && reqStart < aEnd) ||
        (reqEnd > aStart && reqEnd <= aEnd) ||
        (reqStart <= aStart && reqEnd >= aEnd)
      ) {
        throw new Error("TIME_SLOT_TAKEN");
      }
    }

    const newAppt = manager.create(Appointment, {
      service_id: serviceId,
      customer_telegram_id: customerTelegramId,
      customer_name: customerName,
      appointment_date: appointmentDate,
      appointment_time: appointmentTime,
      staff_id: staffId || null,
      status
    });
    
    return await manager.save(newAppt);
  });
}

export async function getAppointmentsForOwner(ownerId: number) {
  const query = apptRepo.createQueryBuilder("a")
    .innerJoinAndMapOne("a.service", Service, "s", "a.service_id = s.id")
    .leftJoinAndMapOne("a.staff", Staff, "st", "a.staff_id = st.id")
    .select([
        "a.*", 
        "s.name as service_name", 
        "s.duration as duration", 
        "st.name as staff_name"
    ])
    .where("s.user_id = :ownerId", { ownerId })
    .andWhere("a.appointment_date >= CURRENT_DATE")
    .andWhere("a.status = 'confirmed'")
    .orderBy("a.appointment_date", "ASC")
    .addOrderBy("a.appointment_time", "ASC");
    
  return await query.getRawMany();
}

export async function getAppointmentsForCustomer(telegramId: number) {
  const query = apptRepo.createQueryBuilder("a")
    .innerJoinAndMapOne("a.service", Service, "s", "a.service_id = s.id")
    .leftJoinAndMapOne("a.staff", Staff, "st", "a.staff_id = st.id")
    .select([
        "a.*", 
        "s.name as service_name", 
        "s.duration as duration", 
        "st.name as staff_name"
    ])
    .where("a.customer_telegram_id = :telegramId", { telegramId })
    .andWhere("a.appointment_date >= CURRENT_DATE")
    .andWhere("a.status = 'confirmed'")
    .orderBy("a.appointment_date", "ASC")
    .addOrderBy("a.appointment_time", "ASC");
    
  return await query.getRawMany();
}

export async function cancelAppointment(id: number, customerTelegramId: number) {
  await apptRepo.update({ id, customer_telegram_id: customerTelegramId }, { status: 'cancelled' });
}

export async function getAppointmentsByDate(ownerId: number, date: string, staffId?: number) {
  const query = apptRepo.createQueryBuilder("a")
    .innerJoin(Service, "s", "a.service_id = s.id")
    .select(["a.appointment_time as appointment_time", "s.duration as duration"])
    .where("s.user_id = :ownerId", { ownerId })
    .andWhere("a.appointment_date = :date", { date })
    .andWhere("a.status = 'confirmed'");
  
  if (staffId) {
    query.andWhere("a.staff_id = :staffId", { staffId });
  } else {
    query.andWhere("a.staff_id IS NULL");
  }
  
  return await query.getRawMany();
}
