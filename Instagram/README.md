# 📸 Instagram Reservation Bot

This directory contains the Instagram-specific microservice for the reservation bot. It communicates with the Meta Graph API via webhooks to handle incoming DMs and connects to the shared database.

## Prerequisites
- Node.js (v18+)
- PostgreSQL (shared with the Telegram bot)
- A Meta Developer Account with a linked Instagram Professional Account.

## Installation

1. Install the dependencies:
   ```bash
   npm install
   ```

2. Configure your Environment Variables:
   Copy `.env.example` to `.env` and fill it in:
   ```bash
   cp .env.example .env
   ```

3. Start the Development Server:
   ```bash
   npm run dev
   ```

## Meta Webhook Configuration
- Your server needs to be accessible via HTTPS. Use `ngrok` for local development: `ngrok http 3000`.
- In your Meta Developer App, subscribe to the `messages` and `messaging_postbacks` webhook events for Instagram.
- Use the `IG_VERIFY_TOKEN` you set in `.env` to verify the webhook.
- The webhook endpoint URL is: `https://<your_domain>/webhook/instagram`