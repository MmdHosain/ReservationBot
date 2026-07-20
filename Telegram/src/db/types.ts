// Telegram/src/db/types.ts
// Best Practice: Strongly typed models mapped perfectly to database schema.

export enum UserOrgRole {
  ADMIN = 'admin',
  PROVIDER = 'provider',
  RECEPTIONIST = 'receptionist',
  CLIENT = 'client'
}

export enum BookingMode {
  SCHEDULED = 'scheduled',
  QUEUED = 'queued'
}

export enum EventStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  WAITING = 'waiting',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELED = 'canceled',
  NO_SHOW = 'no_show'
}

export enum ParticipantRole {
  HOST = 'host',
  ATTENDEE = 'attendee',
  CLIENT = 'client'
}

export interface Organization {
  id: string;
  name: string;
  timezone: string;
  business_category: string;
  deposit_amount?: number | null;
  onboarded_at?: Date | null;
  subscription_expires_at?: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface User {
  id: string;
  full_name: string;
  email?: string;
  phone?: string;
  telegram_id?: number;
  instagram_id?: string;
  calendar_type: string;
  created_at: Date;
}

export interface OrganizationMember {
  id: string;
  organization_id: string;
  user_id: string;
  role: UserOrgRole;
  is_active: boolean;
}

export interface Category {
  id: string;
  organization_id: string;
  name: string;
  created_at: Date;
}

export interface EventType {
  id: string;
  organization_id: string;
  category_id?: string | null;
  name: string;
  duration_minutes: number;
  buffer_minutes: number;
  is_active: boolean;
}

export interface UserEventType {
  id: string;
  user_id: string;
  event_type_id: string;
}

export interface Schedule {
  id: string;
  organization_id: string;
  user_id?: string;
  name: string;
  valid_from: Date | string;
  valid_until?: Date | string;
}

export interface ScheduleRule {
  id: string;
  schedule_id: string;
  day_of_week: number; // 0 = Sunday, 1 = Monday, etc.
  start_time: string; // HH:mm:ss
  end_time: string;   // HH:mm:ss
}

export interface Resource {
  id: string;
  organization_id: string;
  name: string;
  resource_type?: string;
  is_active: boolean;
}

export interface ScheduleException {
  id: string;
  organization_id: string;
  user_id?: string;
  resource_id?: string;
  specific_date: Date | string;
  is_available: boolean;
  start_time?: string;
  end_time?: string;
  reason?: string;
}

export interface Event {
  id: string;
  organization_id: string;
  event_type_id?: string;
  title?: string;
  event_date: Date | string;
  booking_mode: BookingMode;
  status: EventStatus;
  planned_start_time?: Date;
  planned_end_time?: Date;
  queue_number?: number;
  actual_start_time?: Date;
  actual_end_time?: Date;
  reminded_24h: boolean;
  reminded_2h: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface EventParticipant {
  id: string;
  event_id: string;
  user_id: string;
  role: ParticipantRole;
}

export interface EventResource {
  event_id: string;
  resource_id: string;
}

export interface TransactionV2 {
  id: string;
  organization_id: string;
  user_id?: string | null;
  amount: number;
  package_days: number;
  status: string;
  receipt_photo_id?: string | null;
  authority?: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface InboxMessageV2 {
  id: string;
  organization_id: string;
  customer_id: string;
  sender_name: string;
  content: string;
  sender_type: string;
  is_read: boolean;
  created_at: Date;
}
