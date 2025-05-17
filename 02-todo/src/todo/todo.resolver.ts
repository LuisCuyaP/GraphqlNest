import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class TodoResolver {

    @Query(() => [String], { name: 'todos' })
    findAll() {
        return ['A','B','C'];
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
