import config from "../config/index.ts";

export default {
  token: config.platforms.bale.token || config.platforms.telegram.token,
  adminPassword: config.adminPassword,
  providerToken: config.platforms.telegram.providerToken,
  db: config.db,
  platforms: config.platforms,
};
