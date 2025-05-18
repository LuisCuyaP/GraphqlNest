import { Injectable, NotFoundException } from '@nestjs/common';
import { Todo } from './entity/todo.entity';

@Injectable()
export class TodoService {
    private todos: Todo[] = [
        { id: 1, description: 'Learn NestJS', done: false },
        { id: 2, description: 'Learn NestJS2', done: true },
        { id: 3, description: 'Learn NestJS3', done: false }
    ];

    findAll(): Todo[] {
        return this.todos;
    }

    findOne(id: number): Todo {
        const todo = this.todos.find(todo => todo.id === id);
        if(!todo) throw new NotFoundException(`Todo with id ${id} not found`);
        return todo;
    }
}
