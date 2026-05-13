import pkg from "pg";
import config from "../config.ts";

const { Pool } = pkg;

export const pool = new Pool({
  host: config.db.host,
  port: config.db.port,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database,
});

pool.on("connect", () => {
  console.log("✅ PostgreSQL connected");
});

pool.on("error", (err: any) => {
  console.error("❌ PostgreSQL error:", err);
});
