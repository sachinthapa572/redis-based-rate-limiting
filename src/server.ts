import app from "./app";
import config from "./config/env";
import logger from "./utils/logger";

const server = app.listen(config.port, () => {
    logger.info(`Server running in ${config.env} mode on port ${config.port}`);
});

// // Handle unhandled promise rejections
// process.on("unhandledRejection", (err: Error) => {
//     logger.warn("Unhandled rejection", err);
//     server.close(() => {
//         process.exit(1);
//     });
// });

// process.on("uncaughtException", (err: Error) => {
//     logger.error("Uncaught exception", err);
//     server.close(() => {
//         process.exit(1);
//     });
// });

// process.on("SIGTERM", () => {
//     logger.info("SIGTERM received. Shutting down gracefully");
//     server.close(() => {
//         redis.disconnect();
//         logger.info("Process terminated");
//     });
// });
