// src/handlers/index.ts
import { Composer } from "telegraf";
import type { HandlerContext } from "./types.ts";
import * as middleware from "./middleware.ts";

export const botHandlers = new Composer<HandlerContext>();

botHandlers.start(middleware.startHandler);

botHandlers.command("inbox", middleware.enterInbox);
botHandlers.command("manager", middleware.managerHandler);
botHandlers.command("customer", middleware.enterCustumerdashboared);
botHandlers.command("delete", middleware.deleteHandler);

botHandlers.command("shamsi", middleware.setShamsiCalendar);
botHandlers.command("miladi", middleware.setMiladiCalendar);
