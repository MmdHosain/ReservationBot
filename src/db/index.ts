// src/db/index.ts
import { pool } from "./pool.ts";

const createUsersTableSQL = `
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  telegram_id BIGINT UNIQUE NOT NULL,
  salon_name TEXT,
  onboarded_at TIMESTAMP NULL,
  calendar_type VARCHAR(10) DEFAULT 'shamsi',
  work_start_time TIME DEFAULT '09:00',
  work_end_time TIME DEFAULT '18:00',
  break_start_time TIME,
  break_end_time TIME,
  deposit_amount INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
`;

const createStaffTableSQL = `
CREATE TABLE IF NOT EXISTS staff (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
`;

const createServicesTableSQL = `
CREATE TABLE IF NOT EXISTS services (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  duration INTEGER NOT NULL,
  days TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
`;

const createAppointmentsTableSQL = `
CREATE TABLE IF NOT EXISTS appointments (
  id SERIAL PRIMARY KEY,
  service_id INTEGER NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  customer_telegram_id BIGINT NOT NULL,
  customer_name TEXT,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  staff_id INTEGER REFERENCES staff(id) ON DELETE SET NULL,
  status VARCHAR(20) DEFAULT 'confirmed',
  reminded_24h BOOLEAN DEFAULT FALSE,
  reminded_2h BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
`;

const createCustomerSalonsTableSQL = `
CREATE TABLE IF NOT EXISTS customer_salons (
  id SERIAL PRIMARY KEY,
  customer_telegram_id BIGINT NOT NULL,
  salon_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(customer_telegram_id, salon_user_id)
);
`;

const createInboxMessagesTableSQL = `
CREATE TABLE IF NOT EXISTS inbox_messages (
  id SERIAL PRIMARY KEY,
  salon_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  customer_telegram_id BIGINT NOT NULL,
  sender_name TEXT,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
`;

export async function initDB() {
  try {
    await pool.query("SELECT 1");

    await pool.query(createUsersTableSQL);
    await pool.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS salon_name TEXT;").catch(() => {});
    await pool.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS calendar_type VARCHAR(10) DEFAULT 'shamsi';").catch(() => {});
    await pool.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS work_start_time TIME DEFAULT '09:00';").catch(() => {});
    await pool.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS work_end_time TIME DEFAULT '18:00';").catch(() => {});
    await pool.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS break_start_time TIME;").catch(() => {});
    await pool.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS break_end_time TIME;").catch(() => {});
    await pool.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS deposit_amount INTEGER DEFAULT 0;").catch(() => {});

    await pool.query(createStaffTableSQL);

    await pool.query(createServicesTableSQL);
    await pool.query(createAppointmentsTableSQL);
    await pool.query("ALTER TABLE appointments ADD COLUMN IF NOT EXISTS staff_id INTEGER REFERENCES staff(id) ON DELETE SET NULL;").catch(() => {});
    await pool.query("ALTER TABLE appointments ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'confirmed';").catch(() => {});
    await pool.query("ALTER TABLE appointments ADD COLUMN IF NOT EXISTS reminded_24h BOOLEAN DEFAULT FALSE;").catch(() => {});
    await pool.query("ALTER TABLE appointments ADD COLUMN IF NOT EXISTS reminded_2h BOOLEAN DEFAULT FALSE;").catch(() => {});

    await pool.query(createCustomerSalonsTableSQL);
    await pool.query(createInboxMessagesTableSQL);

    console.log("📦 Database ready and tables ensured.");
  } catch (err) {
    console.error("❌ Database initialization failed:", err);
    process.exit(1);
  }
}

export { pool };
