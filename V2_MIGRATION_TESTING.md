# 🧪 V2 Migration & Dual-Write Testing Guide

This guide explains how to test the newly implemented V2 Multi-Tenant Schema side-by-side with the legacy V1 system. The application currently utilizes a **Dual-Write** strategy, meaning actions performed in the bot update both V1 and V2 tables simultaneously to ensure zero downtime and data consistency during the migration phase.

## 🛠 Prerequisites
1. Ensure your PostgreSQL database is running.
2. Start the application: `npm run dev`.
3. Verify in the console that the `setupTablesSQL` successfully created the new tables (`organizations`, `users_v2`, `event_types`, `events`, etc.).
4. Use a Database Client (like DBeaver or pgAdmin) to inspect the raw tables during the tests.

---

## Test Case 1: Manager Onboarding Dual-Write
**Objective**: Ensure that a new manager creates records in both V1 and V2 schemas.

1. In Telegram, send `/manager` (using an account that hasn't registered yet).
2. Follow the setup wizard (Create a Service, Duration, Days, and Salon Name).
3. **Database Verification**:
   - **V1 Check**: Verify rows exist in `users` and `services`.
   - **V2 Check**: 
     - `users_v2`: Check for a new user record.
     - `organizations`: Check for the newly created salon organization.
     - `organization_members`: Verify the user is linked to the organization as `admin`.
     - `event_types`: Verify the service was created here.
     - `schedules` & `schedule_rules`: Verify the default 09:00-18:00 rules were created for the selected days.

---

## Test Case 2: V2 Synchronization (Settings & Services)
**Objective**: Verify the `v2_sync` utility correctly updates V2 tables when V1 settings are modified.

1. Go to the Manager Dashboard -> 🔧 تنظیمات و ابزارها (Settings & Tools).
2. Change Work Hours (e.g., send `10:00-19:00`).
3. Add a Break Time (e.g., send `break 13:00-14:00`).
4. Add a new Service from the Dashboard.
5. **Database Verification**:
   - Check `schedule_rules`: The continuous time blocks should now be split (e.g., 10:00 to 13:00 and 14:00 to 19:00).
   - Check `event_types`: The new service should appear and be linked via `user_event_types`.

---

## Test Case 3: Customer Booking Dual-Write
**Objective**: Verify that a customer booking an appointment creates an Event in the V2 schema.

1. Copy your exclusive Manager booking link.
2. Open it with a secondary Telegram account.
3. Book an appointment for a specific date and time.
4. **Database Verification**:
   - **V1 Check**: Verify the row in `appointments`.
   - **V2 Check**: 
     - `users_v2`: Verify the customer user was created.
     - `events`: Verify a new event is created with `status = 'confirmed'`.
     - `event_participants`: Verify two rows exist for this event (one `host` representing the salon, one `client` representing the customer).

---

## Test Case 4: Customer Cancellation Dual-Write
**Objective**: Verify that cancelling an appointment cascades the status update to V2.

1. As the customer, go to Dashboard -> 📅 نوبت‌های من (My Bookings).
2. Cancel the appointment you just created.
3. **Database Verification**:
   - **V1 Check**: `appointments` status should be `cancelled`.
   - **V2 Check**: `events` status should be `canceled`.

---

## Test Case 5: Instagram Microservice Integration
**Objective**: Verify that the Instagram Webhook interacts seamlessly with the new V2 schema.

1. Make sure your local server is exposed via `ngrok` (e.g., `ngrok http 3000`).
2. Open Postman or terminal and simulate a Meta Webhook payload to your IG endpoint:
   ```bash
   curl -X POST http://localhost:3000/webhook/instagram \
   -H "Content-Type: application/json" \
   -d '{
     "object": "instagram",
     "entry": [{
       "messaging": [{
         "sender": {"id": "123456789_TEST_IG_USER"},
         "message": {"text": "hi"}
       }]
     }]
   }'
   ```
3. **Verification**: 
   - Check terminal logs: The bot should register the IG user in `users_v2`.
   - The application will attempt to fetch `event_types` using `getOrganizationByIGPageId` and build Meta Quick Reply buttons. 
   - *Note: For a fully integrated E2E Meta test, connect the webhook URL to your Facebook Developer App Dashboard and message the IG page directly.*
