import "dotenv/config";

const config = {
  port: parseInt(process.env.PORT || "3000"),
  ig: {
    verifyToken: process.env.IG_VERIFY_TOKEN || "",
    pageToken: process.env.IG_PAGE_ACCESS_TOKEN || "",
  },
  db: {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432"),
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASS || "",
    database: process.env.DB_NAME || "my_telegram_bot",
  }
};

export default config;
