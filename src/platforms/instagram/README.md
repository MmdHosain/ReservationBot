# 📸 Instagram Reservation Bot Adapter

This module contains the Instagram-specific adapter for the reservation bot. It communicates with the Meta Graph API via webhooks to handle incoming DMs and connects to the shared database.

## Activation
In `.env`:
```dotenv
ENABLE_INSTAGRAM=true
PORT=3000
IG_VERIFY_TOKEN=your_secure_verify_token
IG_PAGE_ACCESS_TOKEN=your_meta_page_access_token
```

## Meta Webhook Configuration
- Your server needs to be accessible via HTTPS. Use `ngrok` for local development: `ngrok http 3000`.
- In your Meta Developer App, subscribe to the `messages` and `messaging_postbacks` webhook events for Instagram.
- Use the `IG_VERIFY_TOKEN` you set in `.env` to verify the webhook.
- The webhook endpoint URL is: `https://<your_domain>/webhook/instagram`
