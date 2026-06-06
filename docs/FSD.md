# Functional Specification Document (FSD) - Salon Management Bot

## 1. Introduction
The Salon Management Bot is an automated appointment scheduling platform hosted on the Bale messenger. It facilitates seamless interaction between Service Providers (Managers) and End Customers, automating the booking process, managing schedules, and reducing no-shows.

## 2. User Roles
### 2.1 Service Provider (Manager)
Owners or staff of a salon who configure services, manage availability, and monitor bookings.
### 2.2 End Customer
Users who interact with a salon's unique booking link to reserve time slots.

## 3. Functional Requirements - Manager Suite

### 3.1 Onboarding & Setup
- **Command:** `/manager` (Initial run).
- **Flow:**
    - Define Service Name (e.g., Haircut).
    - Select Service Duration (30, 45, 60, 90 mins).
    - Select Working Days (Persian calendar days).
    - Set Salon Name.
- **Outcome:** Generates a unique deep-link for customers: `https://ble.ir/[bot_username]?start=[manager_telegram_id]`.

### 3.2 Management Dashboard
- **Today's Appointments:** View list of upcoming bookings for the day with customer name, service, time, and assigned staff.
- **Revenue Estimation:** Automatic calculation based on daily booking volume.
- **Service Management:** Add, edit (name, duration, days), or delete services.
- **Staff Management:** Add or remove staff members. If staff are added, customers must select a staff member during booking.

### 3.3 Business Rules & Settings
- **Custom Hours:** Managers can set work start/end times (default 09:00 - 18:00).
- **Break Times:** Managers can set a daily break period where slots are automatically blocked.
- **Deposit System (بیعانه):** Managers can enable a mandatory deposit (in Toman). Bookings remain `pending_payment` until confirmed.
- **Calendar Type:** Toggle between Shamsi (Solar Hijri) and Miladi (Gregorian) via `/shamsi` and `/miladi`.

### 3.4 Data Integrity
- **Command:** `/delete`.
- **Action:** Wipes all data associated with the user (services, appointments, settings).

## 4. Functional Requirements - Customer Suite

### 4.1 Booking Flow (Deep-link driven)
- **Service Selection:** Pick from the list of services provided by the specific salon.
- **Staff Selection:** (Only if the salon has >0 staff members).
- **Date Selection:** Displays available days within the next 7 days based on service availability.
- **Time Selection:** Displays dynamic 30-min (or service-duration) slots.
    - **Logic:** Excludes past times, existing bookings, and manager break times.
- **Deposit Payment:** If enabled, provides a link to a payment gateway (Zarinpal/Mock).
- **Confirmation:** Success message with appointment summary.

### 4.2 Customer Dashboard
- **Command:** `/start` (without payload).
- **My Bookings:** List of all future appointments across different salons.
- **Cancellation:** "Cancel Appointment" button to free up the slot instantly.
- **My Salons:** History of salons visited with quick re-booking links.

## 5. System Logic & Automated Features

### 5.1 Real-Time Availability Engine
- Slot generation queries the `appointments` table for the specific date and staff member to ensure no double bookings occur.
- Intervals are calculated based on the service's defined duration.

### 5.2 Automated Push Notifications
- **New Booking:** Immediate notification to the Manager when a customer confirms.
- **Cancellation:** Notification to Manager if a customer cancels.
- **Reminders (Cron Job):**
    - **24-Hour Reminder:** Sent via bot to the customer a day before the slot.
    - **2-Hour Reminder:** Final push notification sent 2 hours before the service.

## 6. Technical Stack
- **Bot Engine:** Node.js + Telegraf (Custom Bale API root).
- **Database:** PostgreSQL.
- **Date Handling:** Day.js with Intl.DateTimeFormat for Persian localization.