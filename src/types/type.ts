import type { Request } from "express"

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

export interface RateLimiterOptions {
    // Function to extract the identifier from the request
    identifierFn: (req: Request) => string;
    // Maximum bucket capacity (max tokens)
    capacity?: number;
    // Refill rate in tokens per second
    refillRate?: number;
    // Whether to skip the rate limiter for certain requests
    skipFn?: (req: Request) => boolean;
}