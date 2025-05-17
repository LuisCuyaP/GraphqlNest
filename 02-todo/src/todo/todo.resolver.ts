import { Query, Resolver } from '@nestjs/graphql';
import { Todo } from './entity/todo.entity';
import { TodoService } from './todo.service';

@Resolver()
export class TodoResolver {

    constructor(
        private readonly todoService: TodoService
    ){}

    @Query(() => [Todo], { name: 'todos' })
    findAll(): Todo[] {
        return this.todoService.findAll();
    }

    findOne(id: string) {
        return null;
    }

    createTodo() {
        return null;
    }

    updateTodo() {
        return null;
    }

}
