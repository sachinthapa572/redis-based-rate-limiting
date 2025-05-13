import config from "../config/env";
import logger from "../utils/logger";
import redisClient from "../utils/redisClient";

// Define the token bucket rate limiting Lua script
const tokenBucketScript = `
-- KEYS[1] = user key
-- ARGV[1] = bucket capacity
-- ARGV[2] = refill rate (tokens per ms)
-- ARGV[3] = current time in ms
local key = KEYS[1]
local capacity = tonumber(ARGV[1])
local refillRate = tonumber(ARGV[2])
local now = tonumber(ARGV[3])
-- Get the token bucket
local tokenData = redis.call("HMGET", key, "tokens", "lastRefill")
local tokens = tokenData[1]
local lastRefill = tokenData[2]
-- If bucket doesn't exist yet
if tokens == false or lastRefill == false then
  tokens = capacity
  lastRefill = now
end
tokens = tonumber(tokens)
lastRefill = tonumber(lastRefill)
-- Calculate how many tokens to add since last refill
local delta = now - lastRefill
local refill = delta * refillRate
tokens = math.min(capacity, tokens + refill)
lastRefill = now
-- Allow or deny the request
if tokens >= 1 then
  tokens = tokens - 1
  redis.call("HMSET", key, "tokens", tokens, "lastRefill", lastRefill)
  redis.call("PEXPIRE", key, 60000)  -- Expire after 1 minute of inactivity
  return {0, tokens}
else
  local waitTime = math.ceil((1 - tokens) / refillRate)
  return {1, waitTime}
end`;

// Define the custom command
redisClient.defineCommand("tokenBucketRateLimit", {
    numberOfKeys: 1,
    lua: tokenBucketScript,
});


// Function to check if a request is rate limited using token bucket algorithm
export async function checkRateLimit(
    identifier: string,
    capacity: number = config.rateLimit.bucketCapacity || 10,
    refillRatePerSec: number = config.rateLimit.refillRate || 1
): Promise<{ limited: boolean; retryAfter?: number; remainingTokens?: number }> {
    try {
        const now = Date.now();
        // Convert refill rate from tokens/second to tokens/millisecond
        const refillRatePerMs = refillRatePerSec / 1000;

        const [limited, value] = await redisClient.tokenBucketRateLimit(
            `rate-limit:${identifier}`,
            capacity,
            refillRatePerMs,
            now
        );

        if (limited === 0) {
            return {
                limited: false,
                remainingTokens: value
            };
        }

        return {
            limited: true,
            retryAfter: Math.ceil(value / 1000),
        };
    } catch (error) {
        logger.error("Error checking rate limit", error);
        // Fail open - allow the request if Redis is down
        return { limited: false };
    }
}

export default redisClient;