# Comprehensive Testing Instructions

This document provides an exhaustive, step-by-step guide to testing all edge cases and functionalities of the Reservation Bot. It covers the three user roles (Admin, Manager, Customer) as well as automated system tasks (Cron jobs).

## 0. Prerequisites & Setup
1. **Database**: Ensure PostgreSQL is running. The bot will auto-create tables on the first run (`src/db/index.ts`).
2. **Environment**: `.env` must contain `BOT_TOKEN`, `DB_*` credentials, and optionally `ADMIN_PASSWORD`.
3. **Launch**: Run `npm run dev` to start the bot locally.
4. **Tools Needed**: You will need at least two different Telegram/Bale accounts to properly test Manager-Customer interactions, plus access to your database client (e.g., pgAdmin, DBeaver) to manipulate dates for time-travel testing.

---

## 1. Manager (Salon Owner) Scenarios

### 1.1. Onboarding & Registration
- **Action**: Send `/manager` from Account A.
- **Steps**:
  1. Click **🚀 شروع** (Start).
  2. Enter Service Name (e.g., `Haircut`), Duration (`30 minutes`), and Days (e.g., `Saturday`, `Sunday`).
  3. Enter Salon Name (e.g., `VIP Salon`).
- **Expected Outcome**: You receive a success message and enter the Dashboard. Your account receives a 14-day free trial.

### 1.2. Service Management
- **Action**: From Dashboard, click **✂️ مدیریت خدمات** (Manage Services).
- **Test Cases**:
  - **Add Service**: Click **➕ افزودن خدمت جدید** -> Add `Beard Trim` (15 mins, Friday). 
  - **Edit Service**: Click on `Haircut` -> Change duration to 45 mins -> Change days to add Monday. 
  - **Delete Service**: Click `Delete` on `Beard Trim`.
- **Expected Outcome**: Changes reflect immediately. Deleted services no longer appear in the list.

### 1.3. Settings & Staff (Constraints)
- **Action**: Go to **🔧 تنظیمات و ابزارها** -> **⚙️ تنظیمات کاری** (Work Settings).
- **Test Cases**:
  - Send `09:00-18:00` to set work hours.
  - Send `break 13:00-14:00` to set a break.
  - Send `deposit 50000` to require a deposit (Note: functionality is UI-only for now, but saves to DB).
  - Send `nobreak` to clear the break.
- **Action**: Go to **👥 مدیریت پرسنل** (Staff).
- **Test Cases**:
  - Type `John Doe` to add a staff member.
  - Click **❌ حذف John Doe** to test deletion.

### 1.4. Inbox & Customer Interaction
- **Action**: Go to **📥 پیام‌ها** (Inbox).
- **Test Cases**:
  - Ensure it shows `No unread messages` initially.
  - (After Customer sends a message in Step 2.4) Click on the message to read it.
  - Click **📅 ثبت نوبت برای این مشتری** (Book for Customer) to act as a manager booking on behalf of the customer.
  - Check **🗄 مشاهده پیام‌های خوانده‌‌شده** (Archive) to ensure the message moved there after reading.

### 1.5. Billing & Subscription Guard
- **Action**: Go to **💳 مدیریت اشتراک** (Billing).
- **Test Cases**:
  - View current active status and expiry date.
  - Click a package (e.g., 1 Month) -> Simulate Payment -> Verify subscription extends by 30 days.
  - **DB Manipulation**: Manually set `subscription_expires_at` in the `users` table to yesterday for the Manager. Try to click any button on the dashboard.
  - **Expected Outcome**: The bot blocks access and forces you to the Billing scene.

### 1.6. Account Reset
- **Action**: In Settings, click **⚠️ ریست سالن (حذف همه)**.
- **Expected Outcome**: Deletes the user, services, and appointments from the DB and logs the manager out.

---

## 2. Customer Scenarios

### 2.1. Discovery & Booking
- **Action**: Copy the Manager's exclusive link from the Dashboard (e.g., `...start=123`). Open it using Account B.
- **Steps**:
  1. Send `/start 123` (simulates deep link).
  2. Verify you see the salon's Welcome screen.
  3. Click **📝 رزرو نوبت** (Book Appointment).
  4. Select a Service, Date, and Time.
- **Edge Cases to Test**:
  - Try booking during the Manager's `break` hours (slots should not appear).
  - Try booking a slot that is already taken by someone else (slot should be hidden).
  - Try booking a time that exceeds the `work_end_time` (e.g., a 60-min service at 17:30 when the shop closes at 18:00 - slot should not appear).
- **Expected Outcome**: Customer gets a success message. Manager receives an instant Telegram notification about the new booking.

### 2.2. General Dashboard & Reservations
- **Action**: Send `/customer`.
- **Test Cases**:
  - Click **📅 نوبت‌های من** (My Bookings). Verify the booking details are correct.
  - Click **❌ لغو نوبت** (Cancel). Verify the booking is marked as cancelled.
  - Re-book the same slot to ensure it became available again.

### 2.3. Profile & Localization
- **Action**: Send `/profile`.
- **Test Cases**:
  - Toggle between **Shamsi** and **Miladi** calendars.
  - Go back to **📅 نوبت‌های من** (My Bookings). Verify dates are formatted according to the chosen calendar.

### 2.4. Salons History & Messaging
- **Action**: Go to **💇‍♀️ سالن‌های من** (My Salons) in the Customer Dashboard.
- **Test Cases**:
  - Verify the Salon you just visited is listed.
  - Click **✉️ ارسال پیام** (Send Message) -> Type `Hello, do you have parking?`.
  - **Expected Outcome**: Message is stored. Switch to Account A (Manager) to verify receipt in the Inbox.
  - Click **🗑 حذف** (Delete) to remove the salon from history.

### 2.5. Account Deletion
- **Action**: Send `/delete`.
- **Expected Outcome**: Deletes the customer's profile and data. Verify DB records are cleared.

---

## 3. Admin Scenarios

### 3.1. Authentication & Monitoring
- **Action**: Send `/admin` from any account.
- **Test Cases**:
  - Enter wrong password (`test`). **Expected**: Rejection.
  - Enter correct password (`admin123`). **Expected**: Access granted.
  - Note the stats. Create a new user/appointment using another account, then click **🔄 بروزرسانی آمار** (Refresh).
  - **Expected Outcome**: Stats increment accordingly.
  - Click **❌ خروج از مدیریت** (Exit). Send random text to ensure you are no longer in the admin scene.

---

## 4. Automated Tasks (Cron Jobs)

Cron jobs run in `src/core/cron.ts`. To test them without waiting 24 hours, you must manipulate the database.

### 4.1. Appointment Reminders (24h & 2h)
- **Setup**: In your DB client, find an active appointment in the `appointments` table.
- **Test 24h Reminder**:
  - Change `appointment_date` to tomorrow and `appointment_time` to match the current time exactly.
  - Ensure `reminded_24h` is `false`.
  - Wait up to 60 seconds.
  - **Expected Outcome**: Customer receives a "Reminder: You have an appointment tomorrow" message. DB updates `reminded_24h` to `true`.
- **Test 2h Reminder**:
  - Change `appointment_date` to today and `appointment_time` to exactly 2 hours from now.
  - Ensure `reminded_2h` is `false`.
  - Wait up to 60 seconds.
  - **Expected Outcome**: Customer receives the 2-hour warning.

### 4.2. Subscription Expiry Warnings (3 days & 1 day)
- **Setup**: The subscription cron runs specifically at `10:00 AM` every day (checked hourly). To test instantly, temporarily modify `cron.ts` line 67: `if (now.hour() === 10)` to `if (true)` and restart the bot.
- **Test Case**:
  - Set a Manager's `subscription_expires_at` to exactly 3 days from now in the DB.
  - Wait up to 60 minutes (or change the cron interval to `10000` ms for testing).
  - **Expected Outcome**: Manager receives a warning message to renew their panel.
  - Change `subscription_expires_at` to yesterday.
  - **Expected Outcome**: Manager receives an "Expired" notification.
