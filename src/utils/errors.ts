export class AppError extends Error {
    public readonly statusCode: number;
    public readonly isOperational: boolean;

    constructor(message: string, statusCode: number, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class RateLimitError extends AppError {
    public readonly retryAfter: number;

    constructor(message: string, retryAfter: number) {
        super(message, 429);
        this.retryAfter = retryAfter;
    }
}
