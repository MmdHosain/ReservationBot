// src/features/manager/billing/services/billing.service.ts
import { createPendingTransaction, hasPendingTransaction } from "../../../../db/transaction.repository.ts";

export const createPendingTx = async (userId: number, amount: number, packageDays: number, receiptPhotoId: string) => {
  return await createPendingTransaction(userId, amount, packageDays, receiptPhotoId);
};

export const checkPendingTx = async (userId: number) => {
  return await hasPendingTransaction(userId);
};
