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
  @ManyToOne(() => User, (user) => user.lists, { nullable: false, lazy: true })
  @Index('userId-list-index')
  @Field(() => User)
  user: User;

  //porque agrego field aqui @Field(() => User) y lazy: true
  //en mi query de apollo tengo esto
/*   {
    lists {
      id
      name
      user {

      }
    }
  } */
   //pero dentro de user{ } no tengo las referencias para agregar fullname, itemcount, listcount
   //entonces por eso agrego el (@Field(() => User y  lazy: true) y podria hacer esto
   /*   {
    lists {
      id
      name
      user {
        fullName
        itemCount
        listCount
      }
    }
  } */
}
