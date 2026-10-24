// Telegram/src/core/middlewares/context.middleware.ts
import { getOrganizationByTelegramId } from "../../db/organization.repository.ts";
import type { MyContext } from "../types.ts";

export const contextMiddleware = async (ctx: MyContext, next: () => Promise<void>) => {
  ctx.businessCategory = 'beauty'; 
  
  if (ctx.from) {
    try {
      const org = await getOrganizationByTelegramId(ctx.from.id);
      if (org && org.business_category) {
        ctx.orgId = org.id;
        ctx.businessCategory = org.business_category;
      }
    } catch(e) {
      // ignore safely if db not initialized or query fails
    }
  }
  
  await next();
};
