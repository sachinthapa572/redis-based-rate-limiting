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
        bucketCapacity: number;
        refillRate: number;
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
        bucketCapacity: parseInt(process.env.BUCKET_CAPACITY || "5", 10),  // Maximum tokens per bucket
        refillRate: parseInt(process.env.REFILL_RATE || "1", 1),       // Tokens added per second
    },
};

if (config.redis.url === "") {
    console.error("Redis URL is not set in the environment variables.");
    process.exit(1);
}

export default config;
