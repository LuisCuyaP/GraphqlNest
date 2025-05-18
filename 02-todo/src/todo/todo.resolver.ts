import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Todo } from './entity/todo.entity';
import { TodoService } from './todo.service';
import { CreateTodoInput, UpdateTodoInput } from './dto/inputs';


@Resolver()
export class TodoResolver {

    constructor(
        private readonly todoService: TodoService
    ){}

    @Query(() => [Todo], { name: 'todos' })
    findAll(): Todo[] {
        return this.todoService.findAll();
    }

    @Query(() => Todo, { name: 'todo' })
    findOne(@Args('id', { nullable: true, type: () => Int }) id: number): Todo {
        return this.todoService.findOne(id);
    }

    //en un post solo son dos cosas que necesito
    //1. que es lo que quiero retornar : el nuevo objeto Todo creado
    //2. que dto es el que voy a enviar para la insercion de datos: el createTodoInput
    @Mutation(() => Todo, { name: 'createTodo' })
    createTodo(
        @Args('createTodoInput') createTodoInput: CreateTodoInput
    ) {
        return this.todoService.create(createTodoInput);
    }

    @Mutation(() => Todo, { name: 'updateTodo' })
    updateTodo(
        @Args('updateTodoInput') updateTodoInput: UpdateTodoInput
    ) {
        return this.todoService.update(updateTodoInput);
    }

    @Mutation(() => Boolean)
    removeTodo(
        @Args('id', { type: () => Int }) id : number
    ){
        return this.todoService.delete(id);
    }

}
