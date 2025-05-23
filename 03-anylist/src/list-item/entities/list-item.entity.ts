import { Field, ID, ObjectType } from '@nestjs/graphql';
import { List } from 'src/lists/entities/list.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('listItems')
@ObjectType()
export class ListItem {
  
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column({ type: 'numeric' })
  @Field(() => Number)
  quantity: number;

  @Column({ type: 'boolean' })
  @Field(() => Boolean)
  completed: boolean;

  //Relaciones
  //muchos lisItem en cuantas listas pueden aparecer?
  //muchos listItem pueden estar en una lista, o muchas listas pueden estar dentro de un ListItem
  @ManyToOne(() => List, (list) => list.listItem, { lazy: true })
  list: List;
}
