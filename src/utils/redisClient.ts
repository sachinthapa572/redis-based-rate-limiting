
import Redis from "ioredis";
import config from "../config/env";
import logger from "./logger";

const redisClient = new Redis(config.redis.url);

redisClient.on("connect", () => {
    logger.info("Redis client connected");
});

redisClient.on("error", (err) => {
    logger.error("Redis client error", { err });
});


export default redisClient
