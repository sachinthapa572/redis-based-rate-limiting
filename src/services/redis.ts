import { type Result } from "ioredis";
import config from "../config/env";
import logger from "../utils/logger";
import redisClient from "../utils/redisClient";



// Define the rate limiting Lua script
const rateLimitScript = `
local key = KEYS[1]
local limit = tonumber(ARGV[1])
local windowDuration = tonumber(ARGV[2])
local now = tonumber(ARGV[3])
local record = redis.call('HMGET', key, 'windowStart', 'count')
local windowStart = record[1]
local count = record[2]
if windowStart == false then
  redis.call('HSET', key, 'windowStart', now, 'count', 1)
  redis.call('PEXPIRE', key, windowDuration)
  return { 0, 0 }
end
if tonumber(count) < limit then
  redis.call('HINCRBY', key, 'count', 1)
  return { 0, 0 }
end
local timeElapsed = now - tonumber(windowStart);
return { 1, windowDuration - timeElapsed }`;

// Define the custom command
redisClient.defineCommand("rateLimit", {
    numberOfKeys: 1,
    lua: rateLimitScript,
});

// Extend the Redis type to include our custom command
declare module "ioredis" {
    interface RedisCommander<Context> {
        rateLimit(
            key: string,
            limit: number,
            windowDuration: number,
            now: number
        ): Result<[number, number], Context>;
    }
}

// Function to check if a request is rate limited
export async function checkRateLimit(
    identifier: string,
    limit: number = config.rateLimit.maxRequests,
    windowDuration: number = config.rateLimit.windowMs
): Promise<{ limited: boolean; retryAfter?: number }> {
    try {
        const now = new Date();
        const [limited, retryAfter] = await redisClient.rateLimit(
            `rate-limit:${identifier}`,
            limit,
            windowDuration,
            now.getTime()
        );

        if (limited === 0) {
            return { limited: false };
        }

        return {
            limited: true,
            retryAfter: Math.ceil(retryAfter / 1000),
        };
    } catch (error) {
        logger.error("Error checking rate limit", error);
        return { limited: false };
    }
}

export default redisClient;