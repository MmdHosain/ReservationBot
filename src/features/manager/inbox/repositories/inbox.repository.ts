// src/features/manager/inbox/repositories/inbox.repository.ts
import { pool } from "../../../../db/pool.ts";
import type { InboxMessage } from "../types/inbox.types.ts";

export const getUnreadMessages = async (salonUserId: number): Promise<InboxMessage[]> => {
  const res = await pool.query(
    `SELECT * FROM inbox_messages WHERE salon_user_id = $1 AND is_read = false ORDER BY created_at DESC`,
    [salonUserId]
  );
  return res.rows.map((row) => ({
    id: row.id.toString(),
    senderName: row.sender_name || "Unknown",
    content: row.content,
    isRead: row.is_read,
    createdAt: row.created_at,
  }));
};

export const markAsRead = async (id: string, salonUserId: number): Promise<boolean> => {
  const res = await pool.query(
    `UPDATE inbox_messages SET is_read = true WHERE id = $1 AND salon_user_id = $2 RETURNING id`,
    [parseInt(id), salonUserId]
  );
  return (res.rowCount ?? 0) > 0;
};
