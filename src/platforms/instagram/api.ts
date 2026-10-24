import config from "../../config/index.ts";

const GRAPH_API_URL = "https://graph.facebook.com/v19.0/me/messages";

/**
 * Base function to send payloads to the Meta Graph API
 */
export const sendIGMessage = async (recipientId: string, messageData: any) => {
  const url = `${GRAPH_API_URL}?access_token=${config.platforms.instagram.pageToken}`;
  
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recipient: { id: recipientId },
        message: messageData,
      }),
    });
    
    const data = await response.json();
    if (data.error) {
      console.error("❌ [Meta API Error]:", JSON.stringify(data.error, null, 2));
    }
    return data;
  } catch (error) {
    console.error("❌ [Meta API Fetch Exception]:", error);
  }
};

/**
 * Sends a simple text message
 */
export const sendText = (recipientId: string, text: string) => {
  return sendIGMessage(recipientId, { text });
};

/**
 * Sends a text message with quick replies (Buttons)
 * Note: Instagram allows a maximum of 13 quick replies.
 */
export const sendQuickReplies = (
  recipientId: string, 
  text: string, 
  buttons: { title: string, payload: string }[]
) => {
  const quick_replies = buttons.map(btn => ({
    content_type: "text",
    title: btn.title.substring(0, 20),
    payload: btn.payload
  }));

  return sendIGMessage(recipientId, { text, quick_replies });
};
