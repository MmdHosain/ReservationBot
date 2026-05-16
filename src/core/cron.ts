// src/cron.ts
import { pool } from "../db/pool.ts";
import dayjs from "dayjs";
import { Telegraf } from "telegraf";

export function startCronJobs(bot: Telegraf<any>) {
  // Appointment remider cron (every 1 min)
  setInterval(async () => {
    try {
      const now = dayjs();

      const res = await pool.query(`
        SELECT a.*, s.name as service_name, u.salon_name
        FROM appointments a
        JOIN services s ON a.service_id = s.id
        JOIN users u ON s.user_id = u.id
        WHERE a.status = 'confirmed' AND a.reminded_24h = FALSE
      `);

      for (const appt of res.rows) {
        const apptDate = dayjs(appt.appointment_date).format("YYYY-MM-DD");
        const apptTimeStr =
          typeof appt.appointment_time === "string"
            ? appt.appointment_time
            : appt.appointment_time.toISOString().substring(11, 19);
        const apptTime = dayjs(`${apptDate}T${apptTimeStr}`);
        const diffHours = apptTime.diff(now, "hour", true);

        if (diffHours <= 24 && diffHours > 2) {
          await bot.telegram
            .sendMessage(
              appt.customer_telegram_id,
              `یادآوری: شما فردا یک نوبت برای ${appt.service_name} در ${appt.salon_name} دارید.`
            )
            .catch(() => {});
          await pool.query(
            `UPDATE appointments SET reminded_24h = TRUE WHERE id = $1`,
            [appt.id]
          );
        }
      }

      const res2 = await pool.query(`
        SELECT a.*, s.name as service_name, u.salon_name
        FROM appointments a
        JOIN services s ON a.service_id = s.id
        JOIN users u ON s.user_id = u.id
        WHERE a.status = 'confirmed' AND a.reminded_2h = FALSE
      `);

      for (const appt of res2.rows) {
        const apptDate = dayjs(appt.appointment_date).format("YYYY-MM-DD");
        const apptTimeStr =
          typeof appt.appointment_time === "string"
            ? appt.appointment_time
            : appt.appointment_time.toISOString().substring(11, 19);
        const apptTime = dayjs(`${apptDate}T${apptTimeStr}`);
        const diffHours = apptTime.diff(now, "hour", true);

        if (diffHours <= 2 && diffHours > 0) {
          await bot.telegram
            .sendMessage(
              appt.customer_telegram_id,
              `یادآوری: شما تا ۲ ساعت دیگر یک نوبت برای ${appt.service_name} در ${appt.salon_name} دارید.`
            )
            .catch(() => {});
          await pool.query(
            `UPDATE appointments SET reminded_2h = TRUE WHERE id = $1`,
            [appt.id]
          );
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
         const res = await pool.query(`
           SELECT telegram_id, EXTRACT(DAY FROM (subscription_expires_at - NOW())) AS days_left
           FROM users 
           WHERE subscription_expires_at IS NOT NULL 
             AND subscription_expires_at > NOW() 
             AND subscription_expires_at <= NOW() + INTERVAL '3 days'
         `);
         
         for (const user of res.rows) {
           const daysLeft = Math.floor(user.days_left);
           if (daysLeft === 3 || daysLeft === 1) {
             await bot.telegram.sendMessage(
               user.telegram_id,
               `⏳ مدیر عزیز، فقط ${daysLeft} روز تا پایان اعتبار پنل شما باقی مانده است. برای جلوگیری از قطع شدن لینک نوبت‌دهی مشتریان، لطفا اشتراک خود را تمدید کنید.`
             ).catch(() => {});
           }
         }

         const expiredRes = await pool.query(`
           SELECT telegram_id 
           FROM users 
           WHERE subscription_expires_at IS NOT NULL 
             AND subscription_expires_at < NOW() 
             AND subscription_expires_at >= NOW() - INTERVAL '1 day'
         `);

         for (const user of expiredRes.rows) {
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
