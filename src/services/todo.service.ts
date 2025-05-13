import { randomUUID } from "crypto";


interface Todo {
    id: string;
    title: string;
}

const todos: Todo[] = [];

export class TodoService {
    createTodo(title: string): Todo {
        if (!title) {
            throw new Error('Title is required');
        }
        const newTodo: Todo = { id: randomUUID(), title };
        todos.push(newTodo);
        return newTodo;
    }

    getAllTodos(): Todo[] {
        return todos;
    }

    updateTodo(id: string, title: string): Todo {
        const todo = todos.find(t => t.id === id);
        if (!todo) {
            throw new Error('Todo not found');
        }
        if (!title) {
            throw new Error('Title is required');
        }
        todo.title = title;
        return todo;
    }

    deleteTodo(id: string): void {
        const index = todos.findIndex(t => t.id === id);
        if (index === -1) {
            throw new Error('Todo not found');
        }
        todos.splice(index, 1);
    }
}
