// src/handlers/index.ts
import { Composer } from "telegraf";
import type { HandlerContext } from "./types.ts";
import * as middleware from "./middleware.ts";
import * as customerDashboard from "../scenes/customer/dashboard.ts";

export const botHandlers = new Composer<HandlerContext>();

botHandlers.start(middleware.startHandler);
botHandlers.command("manager", middleware.managerHandler);
botHandlers.command("delete", middleware.deleteHandler);
botHandlers.command("my_bookings", customerDashboard.myBookingsHandler);

botHandlers.command("shamsi", middleware.setShamsiCalendar);
botHandlers.command("miladi", middleware.setMiladiCalendar);

botHandlers.action("view_my_bookings", customerDashboard.myBookingsHandler);
botHandlers.action("view_my_salons", customerDashboard.mySalonsHandler);
botHandlers.action("view_customer_guide", customerDashboard.showCustomerGuide);
botHandlers.action("back_to_customer_dashboard", customerDashboard.showCustomerDashboard);
botHandlers.action(/delete_salon_(\d+)/, customerDashboard.deleteSalonHandler);

botHandlers.action(/cancel_appt_(\d+)/, customerDashboard.cancelAppt);
