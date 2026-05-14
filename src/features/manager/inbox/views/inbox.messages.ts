export const InboxMessages = {
  welcome: "📥 Welcome to your Inbox. Here are your unread messages:",
  noMessages: "📭 You have no unread messages at the moment.",
  messageDetail: (sender: string, content: string, date: Date) =>
    `👤 From: ${sender}\n📅 Date: ${date.toLocaleString()}\n\n💬 Message:\n${content}`,
  error:
    "⚠️ An error occurred while fetching your messages. Please try again later.",
};
