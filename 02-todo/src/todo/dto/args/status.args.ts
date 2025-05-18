import { ArgsType, Field } from "@nestjs/graphql";
import { IsBoolean, IsOptional } from "class-validator";

@ArgsType()
export class StatusArgs {

    // ! Validaciones
    @Field(() => Boolean, { nullable: true })
    @IsOptional()
    @IsBoolean()
    status?: boolean;

}