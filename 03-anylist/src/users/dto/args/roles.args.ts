import { ArgsType, Field } from "@nestjs/graphql";
import { IsArray } from "class-validator";

@ArgsType()
export class ValidRolesArgs {

    @Field(() => [String], { nullable: true })
    @IsArray()
    roles: string[] = [];
}
