// src/cron.ts
import { AppDataSource } from "../db/orm.config.ts";
import { Appointment, Service, V1User } from "../db/entities/v1/index.ts";
import dayjs from "dayjs";
import { Telegraf } from "telegraf";

export function startCronJobs(bot: Telegraf<any>) {
  const apptRepo = AppDataSource.getRepository(Appointment);
  const userRepo = AppDataSource.getRepository(V1User);

  // Appointment remider cron (every 1 min)
  setInterval(async () => {
    try {
      const now = dayjs();

      // Query for 24h reminders
      const rem24 = await apptRepo.createQueryBuilder("a")
        .innerJoinAndMapOne("a.service", Service, "s", "a.service_id = s.id")
        .innerJoinAndMapOne("s.user", V1User, "u", "s.user_id = u.id")
        .where("a.status = 'confirmed'")
        .andWhere("a.reminded_24h = FALSE")
        .getMany();

      for (const appt of rem24) {
        const s = (appt as any).service;
        const u = s?.user;
        
        const apptDate = dayjs(appt.appointment_date).format("YYYY-MM-DD");
        const apptTimeStr = typeof appt.appointment_time === "string" 
            ? appt.appointment_time 
            : (appt.appointment_time as Date).toTimeString().substring(0,8);
            
        const apptTime = dayjs(`${apptDate}T${apptTimeStr}`);
        const diffHours = apptTime.diff(now, "hour", true);

        if (diffHours <= 24 && diffHours > 2) {
          await bot.telegram
            .sendMessage(
              appt.customer_telegram_id,
              `یادآوری: شما فردا یک نوبت برای ${s?.name} در ${u?.salon_name} دارید.`
            )
            .catch(() => {});
          
          await apptRepo.update(appt.id, { reminded_24h: true });
        }
      }

      // Query for 2h reminders
      const rem2 = await apptRepo.createQueryBuilder("a")
        .innerJoinAndMapOne("a.service", Service, "s", "a.service_id = s.id")
        .innerJoinAndMapOne("s.user", V1User, "u", "s.user_id = u.id")
        .where("a.status = 'confirmed'")
        .andWhere("a.reminded_2h = FALSE")
        .getMany();

      for (const appt of rem2) {
        const s = (appt as any).service;
        const u = s?.user;
        
        const apptDate = dayjs(appt.appointment_date).format("YYYY-MM-DD");
        const apptTimeStr = typeof appt.appointment_time === "string" 
            ? appt.appointment_time 
            : (appt.appointment_time as Date).toTimeString().substring(0,8);
            
        const apptTime = dayjs(`${apptDate}T${apptTimeStr}`);
        const diffHours = apptTime.diff(now, "hour", true);

        if (diffHours <= 2 && diffHours > 0) {
          await bot.telegram
            .sendMessage(
              appt.customer_telegram_id,
              `یادآوری: شما تا ۲ ساعت دیگر یک نوبت برای ${s?.name} در ${u?.salon_name} دارید.`
            )
            .catch(() => {});
          
          await apptRepo.update(appt.id, { reminded_2h: true });
        }
      }
    } catch (err) {
      console.error("Cron error:", err);
    }
  }, 60000);

  // Subscription expiration cron (every 1 hour)
  setInterval(async () => {
    try {
      const now = dayjs();
      if (now.hour() === 10) {
         const warningUsers = await AppDataSource.query(`
           SELECT telegram_id, EXTRACT(DAY FROM (subscription_expires_at - NOW())) AS days_left
           FROM users 
           WHERE subscription_expires_at IS NOT NULL 
             AND subscription_expires_at > NOW() 
             AND subscription_expires_at <= NOW() + INTERVAL '3 days'
         `);
         
         for (const user of warningUsers) {
           const daysLeft = Math.floor(user.days_left);
           if (daysLeft === 3 || daysLeft === 1) {
             await bot.telegram.sendMessage(
               user.telegram_id,
               `⏳ مدیر عزیز، فقط ${daysLeft} روز تا پایان اعتبار پنل شما باقی مانده است. برای جلوگیری از قطع شدن لینک نوبت‌دهی مشتریان، لطفا اشتراک خود را تمدید کنید.`
             ).catch(() => {});
           }
         }

         const expiredUsers = await AppDataSource.query(`
           SELECT telegram_id 
           FROM users 
           WHERE subscription_expires_at IS NOT NULL 
             AND subscription_expires_at < NOW() 
             AND subscription_expires_at >= NOW() - INTERVAL '1 day'
         `);

         for (const user of expiredUsers) {
           await bot.telegram.sendMessage(
             user.telegram_id,
             `❌ اعتبار پنل شما به پایان رسیده است و نوبت‌دهی آنلاین غیرفعال شد. جهت تمدید وارد پنل /manager شوید.`
           ).catch(() => {});
         }
      }
    } catch (err) {
      console.error("Subscription Cron error:", err);
    }
  }, 3600000);
}
