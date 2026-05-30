# 📱 Instagram Bot Integration Plan

## Architecture Overview
To keep the architecture clean and unified, the project acts as a single monolithic repository with two primary logic domains (`Telegram/` and `Instagram/`). 

- **Unified Entry Point:** The root `bot.ts` starts both the Telegram bot (via Telegraf) and the Instagram bot (via Express) concurrently in the same Node.js process.
- **Shared Configurations:** `package.json`, `tsconfig.json`, and `.env` live in the root directory to manage dependencies centrally.
- **Shared Database:** Both domains will securely read/write from the same PostgreSQL database. The core database connection pool and logic remain untouched in `Telegram/src/db` and can be imported by the Instagram controllers as needed.

## Phase 1: Setup and Webhook Initialization (Done ✅)
- [x] Create separate `Instagram/` directory.
- [x] Root level `bot.ts`, `package.json`, and `tsconfig.json` consolidation.
- [x] Create the Webhook server skeleton (`Instagram/src/index.ts`).
- [x] Create standalone `.env.example` management for shared credentials.

## Phase 2: State & Session Management (Next Steps)
- [ ] Implement an in-memory or DB-backed session store for Instagram to track user states (e.g., `user_id` -> `{ step: 'booking_date' }`).
- [ ] Build bridge utility files in `Instagram/` that import from `../Telegram/src/db/` to query the shared database seamlessly.

## Phase 3: Core API Wrapper
- [ ] Write utility functions to send messages, quick replies, and generic templates using the Facebook Graph API (`https://graph.facebook.com/v19.0/me/messages`).
- [ ] Parse incoming Webhook events cleanly to extract `sender.id` and text payloads.

## Phase 4: Feature Porting
- [ ] **Discovery Flow:** Send a welcome text and list of services when a user sends a message to the Instagram page.
- [ ] **Booking Flow:** Replicate the interactive booking calendar using Instagram Quick Replies (up to 13 buttons at a time) or a structured text menu.
- [ ] **Manager Integration:** Map Instagram DM interactions back to the manager's dashboard so they receive notifications.

## Phase 5: Testing
- [ ] Expose the application via `ngrok` for testing.
- [ ] Link Instagram Professional Account and verify webhook deliveries.
- [ ] Test end-to-end booking from an IG DM to the database.