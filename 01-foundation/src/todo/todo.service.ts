import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';

@Injectable()
export class TodoService {

  private todos: Todo[] = [
    {
      id: 1,
      description: 'Do the dishes',
      done: false,
    },
    {
      id: 2,
      description: 'Take out the trash',
      done: true,
    },
    {
      id: 3,
      description: 'Walk the dog',
      done: false,
    },
  ];

  create( { description }: CreateTodoDto) {
    const todo = new Todo();
    todo.id = this.todos.length + 1;
    todo.description = description;
    this.todos.push(todo);
    return todo;
  }

  findAll(): Todo[] {
    return this.todos;
  }

  findOne(id: number) {
    const todo = this.todos.find((todo) => todo.id === id);
    if (!todo) throw new NotFoundException(`Todo with id ${id} not found`);
    return todo;
  }

  update(id: number, updateTodoDto: UpdateTodoDto) {
    const { done, description } = updateTodoDto;
    const todo = this.findOne(id);
    if(done !== undefined) todo.done = done;
    if(description) todo.description = description;
    this.todos = this.todos.map( dbTodo => {
      if(dbTodo.id === id) {
        return todo;
      }
      return dbTodo;
    });
  }

  remove(id: number) {
    this.findOne(id);
    this.todos = this.todos.filter(todo => todo.id !== id);
  }
}
