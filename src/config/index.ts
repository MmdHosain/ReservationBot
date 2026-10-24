import "dotenv/config";

export interface PlatformConfig {
  bale: {
    enabled: boolean;
    token: string;
    apiRoot: string;
  };
  telegram: {
    enabled: boolean;
    token: string;
    adminPassword: string;
    providerToken: string;
  };
  instagram: {
    enabled: boolean;
    port: number;
    verifyToken: string;
    pageToken: string;
  };
}

export interface DatabaseConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

export interface AppConfig {
  platforms: PlatformConfig;
  db: DatabaseConfig;
  adminPassword: string;
}

const isTrue = (val: string | undefined, defaultVal = false): boolean => {
  if (val === undefined || val === "") return defaultVal;
  return val.toLowerCase() === "true" || val === "1";
};

export const config: AppConfig = {
  platforms: {
    bale: {
      // Default to enabled as Bale is currently the primary target
      enabled: isTrue(process.env.ENABLE_BALE, true),
      token: process.env.BALE_BOT_TOKEN || process.env.BOT_TOKEN || "",
      apiRoot: process.env.BALE_API_ROOT || "https://tapi.bale.ai",
    },
    telegram: {
      // Dormant by default
      enabled: isTrue(process.env.ENABLE_TELEGRAM, false),
      token: process.env.TELEGRAM_BOT_TOKEN || "",
      adminPassword: process.env.TELEGRAM_ADMIN_PASSWORD || process.env.ADMIN_PASSWORD || "admin123",
      providerToken: process.env.TELEGRAM_PROVIDER_TOKEN || process.env.PROVIDER_TOKEN || "",
    },
    instagram: {
      // Dormant by default
      enabled: isTrue(process.env.ENABLE_INSTAGRAM, false),
      port: parseInt(process.env.PORT || "3000", 10),
      verifyToken: process.env.IG_VERIFY_TOKEN || "",
      pageToken: process.env.IG_PAGE_ACCESS_TOKEN || "",
    },
  },
  db: {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432", 10),
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASS || "",
    database: process.env.DB_NAME || "my_telegram_bot",
  },
  adminPassword: process.env.ADMIN_PASSWORD || "admin123",
};

export default config;
