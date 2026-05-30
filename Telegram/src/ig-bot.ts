// src/ig-bot.ts
import express from "express";
import config from "./core/config.ts";

export const startIGBot = () => {
  const app = express();
  app.use(express.json());

  app.get("/webhook/instagram", (req, res) => {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === config.ig.verifyToken) {
      console.log("✅ Instagram Webhook Verified!");
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  });

  app.post("/webhook/instagram", (req, res) => {
    const body = req.body;

    if (body.object === "instagram") {
      console.log("📩 Received Instagram Webhook Event:", JSON.stringify(body, null, 2));

      // TODO: Map the incoming message to the IG session manager
      // TODO: Route to appropriate Instagram controllers based on state
      
      res.status(200).send("EVENT_RECEIVED");
    } else {
      res.sendStatus(404);
    }
  });

  app.listen(config.ig.port, () => {
    console.log(`📱 Instagram Webhook server is listening on port ${config.ig.port}`);
  });
};
