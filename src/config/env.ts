import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

interface Config {
    env: string;
    isProduction: boolean;
    isDevelopment: boolean;
    port: number;
    redis: {
        url: string;
    };
    rateLimit: {
        windowMs: number;
        maxRequests: number;
    };
}

const config: Config = {
    env: process.env.NODE_ENV || "development",
    isProduction: process.env.NODE_ENV === "production",
    isDevelopment: process.env.NODE_ENV === "development",
    port: parseInt(process.env.PORT || "3000", 10),
    redis: {
        url: process.env.REDIS_URL || "",
    },
    rateLimit: {
        windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "86400000", 10), 
        maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100", 10),
    },
};

if (config.redis.url === "") {
    console.error("Redis URL is not set in the environment variables.");
    process.exit(1);
}

export default config;
