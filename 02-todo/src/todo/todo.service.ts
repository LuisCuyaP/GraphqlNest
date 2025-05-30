import { Injectable, NotFoundException } from '@nestjs/common';
import { Todo } from './entity/todo.entity';
import { CreateTodoInput } from './dto/inputs/create-todo.input';
import { UpdateTodoInput } from './dto/inputs';
import { StatusArgs } from './dto/args/status.args';

@Injectable()
export class TodoService {
    private todos: Todo[] = [
        { id: 1, description: 'Learn NestJS', done: false },
        { id: 2, description: 'Learn NestJS2', done: true },
        { id: 3, description: 'Learn NestJS3', done: false },
        { id: 4, description: 'Learn NestJS4', done: false }
    ];

    get totalTodos() {
        return this.todos.length;
    }
    get pendingTodos() {
        return this.todos.filter(todo => todo.done === false).length;
    }
    get completedTodos() {
        return this.todos.filter(todo => todo.done === true).length;
    }

    findAll(statusArgs: StatusArgs): Todo[] {
        if(statusArgs.status === undefined) return this.todos.filter(todo => todo.done === statusArgs.status);
        return this.todos;
    }

    findOne(id: number): Todo {
        const todo = this.todos.find(todo => todo.id === id);
        if(!todo) throw new NotFoundException(`Todo with id ${id} not found`);
        return todo;
    }

    create(createTodoInput: CreateTodoInput): Todo{
        const todo = new Todo();
        todo.description = createTodoInput.description;
        todo.id = Math.max( ...this.todos.map(todo => todo.id), 0) + 1;
        this.todos.push(todo);
        return todo;
    }

    update(updateTodoInput: UpdateTodoInput): Todo {
        const todo = this.findOne(updateTodoInput.id);
        if(updateTodoInput.description) todo.description = updateTodoInput.description;
        if(updateTodoInput.done !== undefined) todo.done = updateTodoInput.done;
        return todo;
    }

    delete(id: number): boolean {
        const todo = this.findOne(id);
        this.todos = this.todos.filter(todo => todo.id !== id);
        return true;
    }    
    
}
