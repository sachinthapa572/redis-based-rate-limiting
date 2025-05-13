import type { Request, Response } from "express";
import { TodoService } from "../services/todo.service";

const todoService = new TodoService();

export class TodoController {
    async create(req: Request, res: Response): Promise<void> {
        try {
            const { title } = req.body;
            const newTodo = todoService.createTodo(title);
            res.status(201).json(newTodo);
        } catch (error) {
            if (error instanceof Error && error.message === "Title is required") {
                res.status(400).json({ message: error.message });
            } else {
                res.status(500).json({ message: "Internal Server Error" });
            }
        }
    }

    async getAll(_req: Request, res: Response): Promise<void> {
        const todos = todoService.getAllTodos();
        res.json(todos);
    }

    async update(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const { title } = req.body;

            console.log(`Updating todo with ID: ${id} and title: ${title}`);
            if (!id || !title) {
                throw new Error("ID and title are required");
            }
            const todo = todoService.getAllTodos().find((t) => t.id === id);
            if (!todo) {
                throw new Error("Todo not found");
            }
            const updatedTodo = todoService.updateTodo(id, title);
            res.json(updatedTodo);
        } catch (error) {
            if (error instanceof Error) {
                console.log(`Error: ${error.message}`);
                res.json({ message: error.message });
            } else {
                console.log("An unexpected error occurred", error);
                res.status(500).json({ message: "Internal Server Error" });
            }
        }
    }

    async delete(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            if (!id) {
                throw new Error("ID is required");
            }
            todoService.deleteTodo(id);
            res.status(204).send();
        } catch (error) {
            if (error instanceof Error) {
                res.json({ message: error.message });
            } else {
                res.status(500).json({ message: "Internal Server Error" });
            }
        }
    }
}
