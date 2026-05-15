// src/core/handlers.ts
import { Composer } from "telegraf";
import type { MyContext } from "./types.ts";

import { handleStartCommand } from "../features/start/controllers/start.controller.ts";
import { handleManagerCommand } from "../features/manager/dashboard/controllers/dashboard.controller.ts";
import { handleDeleteCommand } from "../features/profile/account/controllers/account.controller.ts";
import { handleProfileCommand } from "../features/profile/profile/controllers/profile.controller.ts";
import { handleCustomerCommand } from "../features/customer/index.ts";

export const botHandlers = new Composer<MyContext>();

botHandlers.start(handleStartCommand);
botHandlers.command("manager", handleManagerCommand);
botHandlers.command("customer", handleCustomerCommand);
botHandlers.command("delete", handleDeleteCommand);
botHandlers.command("profile", handleProfileCommand);
