# 📱 Instagram Bot Integration Plan

Integrating an Instagram bot into a Telegram-first architecture is a complex task because the UI paradigms (Inline Keyboards vs. Quick Replies/Text) and APIs (Polling vs. Webhooks) are fundamentally different. This document tracks the implementation plan.

## Phase 1: Foundation & Webhook Setup (Executed ✅)
- [x] Add a specific plan document (`INSTAGRAM_PLAN.md`).
- [x] Add an initialization document (`INSTAGRAM_INIT.md`).
- [x] Update database schema to support `instagram_id` and `instagram_username`.
- [x] Add `express` to dependencies.
- [x] Create the Instagram Webhook server skeleton (`src/ig-bot.ts`).
- [x] Bootstrap the Express server alongside the Telegraf bot in `src/bot.ts`.

## Phase 2: Session & State Management (Next Steps)
- [ ] Create a custom session manager for Instagram users. Telegraf uses `ctx.scene.session`, but for Express, we need an in-memory or Redis-based session store that maps `instagram_id` to `session_data`.
- [ ] Abstract the state machine so it works independently of Telegraf scenes.

## Phase 3: Core API Wrapper
- [ ] Implement a wrapper for the Meta Graph API to send text and quick replies.
- [ ] Create an `IGContext` object that mimics the necessary parts of Telegraf's `ctx` (like `ctx.reply()`, `ctx.session`) so we can reuse existing controller logic.

## Phase 4: Feature Porting
- [ ] **Onboarding:** Adapt the Telegram onboarding scene to a step-by-step text-based flow for Instagram.
- [ ] **Customer Booking:** Port the calendar and time slot selection to a text-based or web-view approach, as Instagram does not support dynamic inline keyboards natively.
- [ ] **Inbox & Notifications:** Ensure manager notifications are sent to the correct platform (Telegram or Instagram) based on where the manager is registered.

## Phase 5: Testing & Deployment
- [ ] Configure Meta App Webhook URL using `ngrok` for local testing.
- [ ] Obtain Advanced Access for Instagram Messaging from Meta.
- [ ] Deploy and verify production webhooks.