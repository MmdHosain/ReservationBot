// src/features/customer/index.ts
import { Scene as DashboardScene } from "./dashboard/dashboard.scene.ts";
import { Scene as ReservationsScene } from "./reservations/reservations.scene.ts";
import { Scene as SalonsScene } from "./salons/salons.scene.ts";
import { Scene as GuideScene } from "./guide/guide.scene.ts";

export const customerFeatureScenes = [
  DashboardScene,
  ReservationsScene,
  SalonsScene,
  GuideScene,
];
