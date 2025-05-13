import axios, { type AxiosResponse } from "axios";
import { Router } from "express";
import { rateLimiter } from "../middleware/rateLimiter";
import { AppError } from "../utils/errors";
import logger from "../utils/logger";
import redisClient from "../utils/redisClient";

const router = Router();

// Apply a rate limiter middleware to all API routes
router.use(
    rateLimiter({
        identifierFn: (req) => {
            // Use IP address as the default identifier
            const identifier = req.ip || "unknown";
            // Optionally add a path-specific prefix to allow different rate limits for different endpoints
            return `${req.method}:${req.path}:${identifier}`;
        },
        skipFn: (req) => {
            return req.path === "/health" || req.path.startsWith("/todo");
        },
    })
);

export interface ResponseJoke {
    error: boolean
    category: string
    type: string
    joke: string
    flags: Flags
    id: number
    safe: boolean
    lang: string
}

export interface Flags {
    nsfw: boolean
    religious: boolean
    political: boolean
    racist: boolean
    sexist: boolean
    explicit: boolean
}


// Health check route
router.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});

// Sample data route
router.get("/data", (req, res) => {
    res.status(200).json({
        status: "success",
        data: {
            message: "This is rate-limited data",
            timestamp: new Date().toISOString(),
        },
    });
});



// Jokes route with Redis caching
router.get("/jokes", async (req, res, next) => {
    try {

        const cacheKey = `jokes:${req.path}`;
        const cacheTTL = 3600;

        const cachedResponse = await redisClient.get(cacheKey);
        if (cachedResponse) {
            logger.info("Serving jokes from Redis cache", cachedResponse);
            res.status(200).json(JSON.parse(cachedResponse));
            return;
        }

        const response: AxiosResponse<ResponseJoke> = await axios.get("https://v2.jokeapi.dev/joke/Any");

        const jokeData = response.data;
        if (!jokeData || jokeData.error) {
            throw new AppError("Failed to fetch joke from external API", 502);
        }

        // Prepare response
        const jokeResponse = {
            status: "success",
            data: {
                joke: jokeData.joke.toString(),
                timestamp: new Date().toISOString(),
            },
        };

        await redisClient.setex(cacheKey, cacheTTL, JSON.stringify(jokeResponse));
        logger.info("Cached jokes in Redis", { cacheKey });

        res.status(200).json(jokeResponse);
    } catch (err) {
        logger.error("Error fetching jokes", { err });
        next(err);
    }
});

export default router;