import type { Result } from "ioredis";

// Extend the Redis type to include our custom command
declare module "ioredis" {
    interface RedisCommander<Context> {
        tokenBucketRateLimit(
            key: string,
            capacity: number,
            refillRate: number,
            now: number
        ): Result<[number, number], Context>;
    }
}
