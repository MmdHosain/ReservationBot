import "dotenv/config";

const config = {
  token: process.env.BOT_TOKEN || "",
  managerToken: process.env.MANAGER_TOKEN || "",
  db: {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432"),
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASS || "",
    database: process.env.DB_NAME || "my_telegram_bot",
  },
};

if (!config.token) {
  console.error("❌ BOT_TOKEN is missing in .env file");
  process.exit(1);
}

export default config;