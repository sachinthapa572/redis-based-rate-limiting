import { Router } from "express";
import apiRoutes from "./api";
import todoRoutes from "./todo.routes";

const router = Router();

router.use("/api", apiRoutes);
router.use("/api/todo", todoRoutes)

// Root endpoint
router.get("/", (req, res) => {
    res.status(200).json({
        status: "success",
        message: "Welcome to the API",
    });
});

// Handle 404 errors
router.use((req, res) => {
    res.status(404).json({
        status: "error",
        message: `Endpoint not found ${req.originalUrl}`,
    });
});

export default router;
