import { Args, Float, Int, Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class HelloWorldResolver {

    @Query(() => String, { description: 'Hola mundo es lo que retorna', name: 'hello' })
    helloWorld(): string {
        return 'Hello World!';
    }

    @Query(() => Float, { name: 'random' })
    getRandomNumber(): number {
        return Math.floor(Math.random() * 100);
    }

    //with parameters
    @Query(() => Int, { name: 'randomFromZeroTo', description: 'Tendra un valor por defecto 6' })
    getRandomFromZeroTo(
        @Args('parameter1', { nullable: true, type: () => Int  }) parameter1 : number = 6
    ): number {
        return Math.floor(Math.random() * parameter1);
    }
}
