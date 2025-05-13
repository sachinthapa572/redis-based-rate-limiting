import { Router } from 'express';
import { TodoController } from '../controllers/todo.controller';

const todoRoutes = Router();
const todoController = new TodoController();

todoRoutes.post('/', todoController.create);
todoRoutes.get('/', todoController.getAll);
todoRoutes.put('/:id', todoController.update);
todoRoutes.delete('/:id', todoController.delete);

export default todoRoutes;