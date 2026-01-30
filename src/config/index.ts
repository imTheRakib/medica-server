import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const config = {
  port: process.env.PORT,
  APP_URL: process.env.APP_URL,
  APP_USERNANE: process.env.APP_USERNAME,
  APP_PASSWORD: process.env.APP_PASSWORD,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
  IMAGEBB_API_KEY: process.env.IMAGEBB_API_KEY,
};

export default config;
