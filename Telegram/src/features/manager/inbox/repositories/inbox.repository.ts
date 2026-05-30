// src/features/manager/inbox/repositories/inbox.repository.ts
import { pool } from "../../../../db/pool.ts";
import type { InboxMessage } from "../types/inbox.types.ts";

export const getUnreadMessages = async (salonUserId: number): Promise<InboxMessage[]> => {
  const res = await pool.query(
    `SELECT DISTINCT ON (customer_telegram_id) *
     FROM inbox_messages 
     WHERE salon_user_id = $1 AND is_read = false AND (sender_type = 'customer' OR sender_type IS NULL) 
     ORDER BY customer_telegram_id, created_at DESC`,
    [salonUserId]
  );
  return res.rows.map((row) => ({
    id: row.id.toString(),
    customerTelegramId: row.customer_telegram_id,
    senderName: row.sender_name || "Unknown",
    content: row.content,
    isRead: row.is_read,
    createdAt: row.created_at,
    senderType: row.sender_type || "customer",
  }));
};

export const getArchivedMessages = async (salonUserId: number): Promise<InboxMessage[]> => {
  const res = await pool.query(
    `SELECT DISTINCT ON (customer_telegram_id) *
     FROM inbox_messages 
     WHERE salon_user_id = $1 AND is_read = true AND (sender_type = 'customer' OR sender_type IS NULL) 
     ORDER BY customer_telegram_id, created_at DESC LIMIT 50`,
    [salonUserId]
  );
  return res.rows.map((row) => ({
    id: row.id.toString(),
    customerTelegramId: row.customer_telegram_id,
    senderName: row.sender_name || "Unknown",
    content: row.content,
    isRead: row.is_read,
    createdAt: row.created_at,
    senderType: row.sender_type || "customer",
  }));
};

export const markCustomerMessagesAsRead = async (salonUserId: number, customerTelegramId: string | number): Promise<boolean> => {
  const res = await pool.query(
    `UPDATE inbox_messages SET is_read = true WHERE salon_user_id = $1 AND customer_telegram_id = $2`,
    [salonUserId, customerTelegramId]
  );
  return true;
};

export const getMessageById = async (id: string, salonUserId: number): Promise<InboxMessage | null> => {
  const res = await pool.query(
    `SELECT * FROM inbox_messages WHERE id = $1 AND salon_user_id = $2`,
    [parseInt(id), salonUserId]
  );
  if (res.rows.length === 0) return null;
  const row = res.rows[0];
  return {
    id: row.id.toString(),
    customerTelegramId: row.customer_telegram_id,
    senderName: row.sender_name || "Unknown",
    content: row.content,
    isRead: row.is_read,
    createdAt: row.created_at,
    senderType: row.sender_type || "customer",
  };
};

export const getConversation = async (salonUserId: number, customerTelegramId: string | number, limit: number = 10): Promise<InboxMessage[]> => {
  const res = await pool.query(
    `SELECT * FROM inbox_messages WHERE salon_user_id = $1 AND customer_telegram_id = $2 ORDER BY created_at DESC LIMIT $3`,
    [salonUserId, customerTelegramId, limit]
  );
  return res.rows.map((row) => ({
    id: row.id.toString(),
    customerTelegramId: row.customer_telegram_id,
    senderName: row.sender_name || "Unknown",
    content: row.content,
    isRead: row.is_read,
    createdAt: row.created_at,
    senderType: row.sender_type || "customer",
  })).reverse();
};
