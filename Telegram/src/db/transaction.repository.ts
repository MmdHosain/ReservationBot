// src/db/transaction.repository.ts
import { AppDataSource } from "./orm.config.ts";
import { Transaction, V1User } from "./entities/v1/index.ts";

const repo = AppDataSource.getRepository(Transaction);

export async function createPendingTransaction(userId: number, amount: number, packageDays: number, receiptPhotoId: string) {
  const tx = repo.create({
    user_id: userId, 
    amount, 
    package_days: packageDays, 
    status: 'pending', 
    receipt_photo_id: receiptPhotoId 
  });
  return await repo.save(tx);
}

export async function hasPendingTransaction(userId: number) {
  const count = await repo.countBy({ user_id: userId, status: 'pending' });
  return count > 0;
}

export async function getPendingTransactions() {
  const query = repo.createQueryBuilder("t")
    .innerJoin(V1User, "u", "t.user_id = u.id")
    .select([
      "t.*", 
      "u.telegram_id AS telegram_id", 
      "u.salon_name AS salon_name"
    ])
    .where("t.status = 'pending'")
    .orderBy("t.created_at", "ASC");
    
  return await query.getRawMany();
}

export async function updateTransactionStatus(id: number, status: string) {
  await repo.update(id, { status });
  return await repo.findOneBy({ id });
}
