// src/features/admin/index.ts
import { Scene as AdminScene } from "./admin.scene.ts";
import { handleAdminCommand } from "./controllers/admin.controller.ts";

export const adminFeatureScenes = [AdminScene];
export { handleAdminCommand };
