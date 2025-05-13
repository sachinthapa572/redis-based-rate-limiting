import { error } from "console";
import type { NextFunction, Request, Response } from "express";
import config from "../config/env";
import { checkRateLimit } from "../services/redis";
import { RateLimitError } from "../utils/errors";
import logger from "../utils/logger";

interface RateLimiterOptions {
    // Function to extract the identifier from the request
    identifierFn: (req: Request) => string;
    // Maximum number of requests allowed in the window
    limit?: number;
    // Duration of the rate limit window in milliseconds
    windowMs?: number;
    // Whether to skip the rate limiter for certain requests
    skipFn?: (req: Request) => boolean;
}

export const rateLimiter = ({
    identifierFn,
    limit = config.rateLimit.maxRequests,
    windowMs = config.rateLimit.windowMs,
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

            // Check if the request is rate limited
            const { limited, retryAfter } = await checkRateLimit(
                identifier,
                limit,
                windowMs
            );

            // Set RateLimit headers
            res.set("X-RateLimit-Limit", `${limit}`);

            if (limited && retryAfter) {
                // If rate limited, throw an error
                logger.info("Rate limit exceeded", error);
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
