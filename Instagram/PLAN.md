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

## Phase 2: State & Session Management (Done ✅)
- [x] Implement an in-memory session store for Instagram to track user states (`Instagram/src/core/session.ts`).
- [x] Build bridge utility files in `Instagram/src/db/bridge.ts` that import from `Telegram/src/db/` to query the shared database seamlessly.
- [x] Make `telegram_id` nullable in the DB to support Instagram-only users.
- [x] Parse Webhook payloads, sync users with the database, and retrieve session state in the webhook router.

## Phase 3: Core API Wrapper (Next Steps)
- [ ] Write utility functions to send messages, quick replies, and generic templates using the Facebook Graph API (`https://graph.facebook.com/v19.0/me/messages`).
- [ ] Create an IG Context wrapper to abstract the Meta API and mimic the Telegraf `ctx` where possible, easing feature porting.

## Phase 4: Feature Porting
- [ ] **Discovery Flow:** Send a welcome text and list of services when a user sends a message to the Instagram page.
- [ ] **Booking Flow:** Replicate the interactive booking calendar using Instagram Quick Replies (up to 13 buttons at a time) or a structured text menu.
- [ ] **Manager Integration:** Map Instagram DM interactions back to the manager's dashboard so they receive notifications.

## Phase 5: Testing
- [ ] Expose the application via `ngrok` for testing.
- [ ] Link Instagram Professional Account and verify webhook deliveries.
- [ ] Test end-to-end booking from an IG DM to the database.