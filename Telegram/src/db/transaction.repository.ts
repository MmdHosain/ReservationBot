// src/db/transaction.repository.ts
import { pool } from "./pool.ts";

export async function createPendingTransaction(userId: number, amount: number, packageDays: number, receiptPhotoId: string) {
  const res = await pool.query(
    `INSERT INTO transactions (user_id, amount, package_days, status, receipt_photo_id) VALUES ($1, $2, $3, 'pending', $4) RETURNING *`,
    [userId, amount, packageDays, receiptPhotoId]
  );
  return res.rows[0];
}

export async function hasPendingTransaction(userId: number) {
  const res = await pool.query(`SELECT 1 FROM transactions WHERE user_id = $1 AND status = 'pending'`, [userId]);
  return res.rows.length > 0;
}

export async function getPendingTransactions() {
  const res = await pool.query(`SELECT t.*, u.telegram_id, u.salon_name FROM transactions t JOIN users u ON t.user_id = u.id WHERE t.status = 'pending' ORDER BY t.created_at ASC`);
  return res.rows;
}

export async function updateTransactionStatus(id: number, status: string) {
  const res = await pool.query(`UPDATE transactions SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`, [status, id]);
  return res.rows[0];
}
