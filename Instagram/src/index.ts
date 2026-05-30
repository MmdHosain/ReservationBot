import express from "express";
import config from "./config.ts";

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
    console.log("📩 Received Instagram Webhook Event:");
    console.dir(body, { depth: null });

    // TODO: Process Instagram DM entries
    // 1. Extract sender ID
    // 2. Fetch session state
    // 3. Route to logic controller
    // 4. Update database using pg
    
    res.status(200).send("EVENT_RECEIVED");
  } else {
    res.sendStatus(404);
  }
});

app.listen(config.port, () => {
  console.log(`📱 Instagram Webhook server is listening on port ${config.port}`);
});
