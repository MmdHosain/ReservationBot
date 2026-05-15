// src/features/customer/index.ts
import { Scene as DashboardScene } from "./dashboard/dashboard.scene.ts";
import { Scene as ReservationsScene } from "./reservations/reservations.scene.ts";
import { Scene as SalonsScene } from "./salons/salons.scene.ts";
import { Scene as GuideScene } from "./guide/guide.scene.ts";
import type { MyContext } from "../../core/types.ts";

export const customerFeatureScenes = [
  DashboardScene,
  ReservationsScene,
  SalonsScene,
  GuideScene,
];

export const handleCustomerCommand = async (ctx: MyContext) => {
  await ctx.scene.enter("CUSTOMER_DASHBOARD_SCENE");
};
