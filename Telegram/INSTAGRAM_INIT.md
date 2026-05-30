# 🚀 Initiating the Instagram Bot

To get the Instagram bot running, you need to configure Meta Webhooks and provide the necessary environment variables.

## 1. Environment Variables
Add the following variables to your `.env` file:
```env
# Instagram / Meta API Configuration
IG_VERIFY_TOKEN=your_custom_secure_verify_token
IG_PAGE_ACCESS_TOKEN=your_facebook_page_access_token
IG_PORT=3000
```

## 2. Meta Developer Portal Setup
1. Go to [Meta for Developers](https://developers.facebook.com/).
2. Create an App and set its type to **Business**.
3. Add the **Instagram Graph API** product.
4. Link your Instagram Business Account and your Facebook Page.
5. In the **Webhooks** section, subscribe to `messages` and `messaging_postbacks`.
6. Provide your server's public URL (e.g., `https://api.yourdomain.com/webhook/instagram`) and the `IG_VERIFY_TOKEN` you set in `.env`.

## 3. Running the Server
The Instagram webhook server is built using `express` and is initialized in `src/ig-bot.ts`. It runs concurrently with the Telegram bot.

Start the project:
```bash
npm run dev
```

You should see:
```text
✅ PostgreSQL connected
📦 Database ready and tables ensured.
📱 Instagram Webhook server is listening on port 3000
✨ Bot is running…
```