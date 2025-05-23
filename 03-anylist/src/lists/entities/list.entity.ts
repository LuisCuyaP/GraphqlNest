import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'lists' })
@ObjectType()
export class List {
  
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  @Field(() => String)
  name: string;

  //¿una lista cuantos usuarios puede tener?
  //solo puede tener uno, esta lista le corresponde a un usuario
  //pueden ver muchas listas que le correspondan a ese mismo usuario
  @ManyToOne(() => User, (user) => user.lists, { nullable: false })
  @Index('userId-list-index')
  user: User;
}
