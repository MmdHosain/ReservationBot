# 📱 Instagram Bot Integration Plan

To keep the architecture clean, the project has been split into two independent services (directories): `Telegram` and `Instagram`.

## Architecture Overview
- **Telegram Service:** Runs the primary Telegram (Bale) bot using Telegraf. It handles the initial database creation and migrations.
- **Instagram Service:** Runs an Express server to receive Meta Webhooks and communicate with the Instagram Graph API. It connects directly to the shared PostgreSQL database to access services, appointments, and users.

Since the database modifications to support Instagram (adding `instagram_id`) are minor, the core database logic remains inside the `Telegram` directory, and the `Instagram` directory will directly query the shared database.

## Phase 1: Setup and Webhook Initialization (Done ✅)
- [x] Create separate `Instagram/` directory.
- [x] Initialize `package.json` with `express` and `pg` for database access.
- [x] Create the Webhook server skeleton (`src/index.ts`).
- [x] Create standalone `.env` management for Instagram credentials.

## Phase 2: State & Session Management (Next Steps)
- [ ] Implement an in-memory or DB-backed session store to track user states (e.g., `user_id` -> `{ step: 'booking_date' }`) since we no longer have Telegraf's `ctx.session`.
- [ ] Build a database utility module in `Instagram/src/db` to query the shared database for salons, services, and availability.

## Phase 3: Core API Wrapper
- [ ] Write utility functions to send messages, quick replies, and generic templates using the Facebook Graph API (`https://graph.facebook.com/v19.0/me/messages`).
- [ ] Parse incoming Webhook events cleanly to extract `sender.id` and text payloads.

## Phase 4: Feature Porting
- [ ] **Discovery Flow:** Send a welcome text and list of services when a user sends a message to the Instagram page.
- [ ] **Booking Flow:** Replicate the interactive booking calendar using Instagram Quick Replies (up to 13 buttons at a time) or a structured text menu.
- [ ] **Manager Integration:** Map Instagram DM interactions back to the manager's dashboard so they receive notifications.

## Phase 5: Testing
- [ ] Expose `Instagram/` via `ngrok` for testing.
- [ ] Link Instagram Professional Account and verify webhook deliveries.
- [ ] Test end-to-end booking from an IG DM to the database.