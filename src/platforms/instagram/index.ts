// src/platforms/instagram/index.ts
import express from "express";
import config from "../../config/index.ts";
import { getOrCreateIGUser } from "../../db/user.repository.ts";
import { IGContext } from "./context.ts";
import { handleIGEvent } from "./router.ts";

export const startInstagramBot = () => {
  if (!config.platforms.instagram.enabled) {
    console.log("⚪ [Instagram Platform] Disabled via configuration.");
    return;
  }

  const app = express();
  app.use(express.json());

  // Meta Webhook Verification Endpoint
  app.get("/webhook/instagram", (req, res) => {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === config.platforms.instagram.verifyToken) {
      console.log("✅ Instagram Webhook Verified!");
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  });

  // Meta Webhook Event Receiver
  app.post("/webhook/instagram", async (req, res) => {
    const body = req.body;

    if (body.object === "instagram") {
      // Respond to Meta immediately to prevent timeout retries
      res.status(200).send("EVENT_RECEIVED");

      try {
        for (const entry of body.entry) {
          for (const messagingEvent of entry.messaging) {
            const senderId = messagingEvent.sender.id;
            
            // Ignore echoes from the page itself
            if (senderId === config.platforms.instagram.pageToken) continue;

            // 1. Sync User in Shared Database
            await getOrCreateIGUser(senderId);

            // 2. Wrap event in IGContext
            const ctx = new IGContext(senderId, messagingEvent);

            // 3. Route to handlers
            await handleIGEvent(ctx);
          }
        }
      } catch (err) {
        console.error("❌ [Instagram Webhook Error]:", err);
      }
    } else {
      res.sendStatus(404);
    }
  });

  const port = config.platforms.instagram.port;
  app.listen(port, () => {
    console.log(`✨ [Instagram Bot] Webhook listening on port ${port}...`);
  });
};
