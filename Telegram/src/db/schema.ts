// Telegram/src/db/schema.ts
// Best Practice: Separate raw SQL schema definitions from execution logic.

export const setupEnumsSQL = `
DO $$ BEGIN
  CREATE TYPE user_org_role AS ENUM ('admin', 'provider', 'receptionist', 'client');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE booking_mode AS ENUM ('scheduled', 'queued');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE event_status AS ENUM ('pending', 'confirmed', 'waiting', 'in_progress', 'completed', 'canceled', 'no_show');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE participant_role AS ENUM ('host', 'attendee', 'client');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
`;

export const setupTablesSQL = `
-- Ensure UUID extension is available
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL,
  timezone VARCHAR DEFAULT 'UTC',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR NOT NULL,
  email VARCHAR UNIQUE,
  phone VARCHAR,
  telegram_id BIGINT UNIQUE,
  instagram_id VARCHAR(100) UNIQUE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS organization_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role user_org_role NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  UNIQUE(organization_id, user_id)
);

CREATE TABLE IF NOT EXISTS event_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR NOT NULL,
  duration_minutes INT NOT NULL,
  buffer_minutes INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS user_event_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  event_type_id UUID REFERENCES event_types(id) ON DELETE CASCADE NOT NULL,
  UNIQUE(user_id, event_type_id)
);

CREATE TABLE IF NOT EXISTS schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NULL,
  name VARCHAR NOT NULL,
  valid_from DATE NOT NULL,
  valid_until DATE NULL
);

CREATE TABLE IF NOT EXISTS schedule_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  schedule_id UUID REFERENCES schedules(id) ON DELETE CASCADE,
  day_of_week INT NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL
);

CREATE TABLE IF NOT EXISTS resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR NOT NULL,
  resource_type VARCHAR,
  is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS schedule_exceptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NULL,
  resource_id UUID REFERENCES resources(id) ON DELETE CASCADE NULL,
  specific_date DATE NOT NULL,
  is_available BOOLEAN NOT NULL,
  start_time TIME NULL,
  end_time TIME NULL,
  reason VARCHAR
);

CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  event_type_id UUID REFERENCES event_types(id) ON DELETE SET NULL,
  title VARCHAR,
  event_date DATE NOT NULL,
  booking_mode booking_mode DEFAULT 'scheduled',
  status event_status DEFAULT 'pending',
  planned_start_time TIMESTAMP NULL,
  planned_end_time TIMESTAMP NULL,
  queue_number INT NULL,
  actual_start_time TIMESTAMP NULL,
  actual_end_time TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS event_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role participant_role NOT NULL,
  UNIQUE(event_id, user_id)
);

CREATE TABLE IF NOT EXISTS event_resources (
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  resource_id UUID REFERENCES resources(id) ON DELETE CASCADE,
  PRIMARY KEY (event_id, resource_id)
);
`;

// Index definitions to optimize lookups for common queries
export const setupIndexesSQL = `
CREATE INDEX IF NOT EXISTS idx_org_members_user ON organization_members(user_id);
CREATE INDEX IF NOT EXISTS idx_events_org_date ON events(organization_id, event_date);
CREATE INDEX IF NOT EXISTS idx_schedule_rules_sched ON schedule_rules(schedule_id);
CREATE INDEX IF NOT EXISTS idx_event_participants_event ON event_participants(event_id);
CREATE INDEX IF NOT EXISTS idx_event_participants_user ON event_participants(user_id);
`;
