// Instagram/src/core/context.ts
import { getSession, updateSession, IGSessionData } from "./session.ts";
import { sendText, sendQuickReplies } from "./api.ts";

/**
 * IGContext mimics Telegraf's `ctx` object to make it easier to port features
 * from the Telegram bot over to Instagram.
 */
export class IGContext {
  public senderId: string;
  public event: any;
  
  // Mimic Telegraf properties
  public from: { id: string };
  public message?: { text: string };
  public callbackQuery?: { data: string };

  constructor(senderId: string, event: any) {
    this.senderId = senderId;
    this.event = event;
    this.from = { id: senderId };

    // Parse message vs postback/quick_reply
    if (event.message) {
      if (event.message.quick_reply && event.message.quick_reply.payload) {
        // User tapped a Quick Reply
        this.callbackQuery = { data: event.message.quick_reply.payload };
      } else if (event.message.text) {
        // User typed text
        this.message = { text: event.message.text };
      }
    } else if (event.postback && event.postback.payload) {
      // User tapped an Inline Button / Persistent Menu
      this.callbackQuery = { data: event.postback.payload };
    }
  }

  /**
   * Get current user session
   */
  get session(): IGSessionData {
    return getSession(this.senderId);
  }

  /**
   * Update current user session
   */
  set session(data: Partial<IGSessionData>) {
    updateSession(this.senderId, data);
  }

  /**
   * Reply with a text message
   */
  async reply(text: string) {
    return sendText(this.senderId, text);
  }

  /**
   * Reply with text and quick reply buttons
   */
  async replyWithKeyboard(text: string, buttons: { title: string, payload: string }[]) {
    return sendQuickReplies(this.senderId, text, buttons);
  }

  /**
   * Convenience method to extract regex matches from callback payloads
   */
  match(pattern: RegExp): RegExpExecArray | null {
    if (this.callbackQuery && this.callbackQuery.data) {
      return pattern.exec(this.callbackQuery.data);
    }
    return null;
  }
}
