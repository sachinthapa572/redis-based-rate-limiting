import type { NextFunction, Request, Response } from "express";
import config from "../config/env";
import { checkRateLimit } from "../services/redis";
import type { RateLimiterOptions } from "../types/type";
import { RateLimitError } from "../utils/errors";
import logger from "../utils/logger";



export const rateLimiter = ({
    identifierFn,
    capacity = config.rateLimit.bucketCapacity || 10,
    refillRate = config.rateLimit.refillRate || 1,
    skipFn,
}: RateLimiterOptions) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Skip rate limiting if the skipFn returns true
            if (skipFn && skipFn(req)) {
                return next();
            }

            // Get the identifier for this request
            const identifier = identifierFn(req);

            // Check if the request is rate limited using token bucket algorithm
            const { limited, retryAfter, remainingTokens } = await checkRateLimit(
                identifier,
                capacity,
                refillRate
            );

            // Set RateLimit headers
            res.set("X-RateLimit-Limit", `${capacity}`);
            if (remainingTokens !== undefined) {
                res.set("X-RateLimit-Remaining", `${remainingTokens}`);
            }

            if (limited && retryAfter) {
                // If rate limited, throw an error
                logger.info(`Rate limit exceeded for ${identifier}`);
                res.set("Retry-After", `${retryAfter}`);
                throw new RateLimitError("Rate limit exceeded", retryAfter);
            }

            next();
        } catch (error) {
            if (error instanceof RateLimitError) {
                res.status(429).json({
                    status: "error",
                    message: "Too many requests, please try again later",
                    retryAfter: error.retryAfter,
                });
            } else {
                next(error);
            }
        }
    };
};