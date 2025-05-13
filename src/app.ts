import cors from "cors";
import express, { type ErrorRequestHandler } from "express";
import helmet from "helmet";
import morgan from "morgan";
import config from "./config/env";
import routes from "./routes";
import { AppError } from "./utils/errors";

const app = express();
app.use(morgan("dev"));

app.set("trust proxy", true);

app.use(helmet());

app.use(
    cors({
        origin: config.isProduction ? process.env.CORS_ORIGIN : "*",
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

app.use(express.json({ limit: "10kb" }));

app.use(express.urlencoded({ extended: true, limit: "10kb" }));

app.use(routes);

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            status: "error",
            message: err.message,
        });
    } else {
        res.status(500).json({
            status: "error",
            message: config.isProduction ? "Something went wrong" : err.message,
        });
    }
};

app.use(errorHandler);

export default app;
