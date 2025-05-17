import { ObjectType } from "@nestjs/graphql";

@ObjectType()
export class Todo {
    id: number;
    description: string;
    done: boolean = false;
}