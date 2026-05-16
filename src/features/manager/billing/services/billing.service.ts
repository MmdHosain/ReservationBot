// src/features/manager/billing/services/billing.service.ts
import { renewSubscription } from "../../../../db/user.repository.ts";

export const renew = async (userId: number, days: number) => {
  await renewSubscription(userId, days);
};
