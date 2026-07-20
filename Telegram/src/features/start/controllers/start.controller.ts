// src/features/start/controllers/start.controller.ts
import type { MyContext } from "../../../core/types.ts";
import * as service from "../services/start.service.ts";
import { handleManagerCommand } from "../../manager/dashboard/controllers/dashboard.controller.ts";
import { getOrganizationByTelegramId } from "../../../db/organization.repository.ts";

export const handleStartCommand = async (ctx: MyContext) => {
  const telegramId = ctx.from?.id;
  if (!telegramId) return;

  const text = ctx.message && "text" in ctx.message ? ctx.message.text : "";
  const parts = text.split(" ");

  if (parts.length > 1) {
    const ownerId = parseInt(parts[1], 10);
    const owner = await service.getSalonOwner(ownerId);
    
    if (owner && owner.subscription_expires_at && new Date(owner.subscription_expires_at) < new Date()) {
      await ctx.reply("متأسفانه نوبت‌دهی آنلاین این سالن در حال حاضر غیرفعال است.");
      return;
    }

    await service.processStartPayload(telegramId, parts[1]);
    
    // V2 Context Injection
    if (owner) {
       const org = await getOrganizationByTelegramId(owner.telegram_id);
       if (org) ctx.orgId = org.id;
       
       await ctx.scene.enter("CUSTOMER_SALON_DASHBOARD_SCENE", { salonId: owner.id, salonName: owner.salon_name });
       return;
    }
  }

  await handleManagerCommand(ctx);
};
