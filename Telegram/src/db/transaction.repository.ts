// src/db/transaction.repository.ts
import { AppDataSource } from "./orm.config.ts";
import { TransactionV2 } from "./entities/TransactionV2.ts";

const repo = AppDataSource.getRepository(TransactionV2);

export async function createPendingTransaction(orgId: string, userId: string, amount: number, packageDays: number, receiptPhotoId: string) {
  const tx = repo.create({
    organization: { id: orgId },
    user: { id: userId }, 
    amount, 
    package_days: packageDays, 
    status: 'pending', 
    receipt_photo_id: receiptPhotoId 
  });
  return await repo.save(tx);
}

export async function hasPendingTransaction(orgId: string) {
  const count = await repo.countBy({ organization: { id: orgId }, status: 'pending' });
  return count > 0;
}

export async function getPendingTransactions() {
  const query = repo.createQueryBuilder("t")
    .innerJoinAndSelect("t.organization", "o")
    .innerJoinAndSelect("t.user", "u")
    .where("t.status = 'pending'")
    .orderBy("t.created_at", "ASC");
    
  const txs = await query.getMany();
  return txs.map(t => ({
    id: t.id,
    amount: t.amount,
    package_days: t.package_days,
    receipt_photo_id: t.receipt_photo_id,
    salon_name: t.organization.name,
    user_id: t.user?.id,
    telegram_id: t.user?.telegram_id
  }));
}

export async function updateTransactionStatus(id: string, status: string) {
  await repo.update(id, { status });
  return await repo.findOne({ where: { id }, relations: ["user", "organization"] });
}
