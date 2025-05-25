import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';

import { Item } from './../../items/entities/item.entity';
import { List } from './../../lists/entities/list.entity';

@Entity('listItems')
@Unique('listItem-item', ['list','item'])
@ObjectType()
export class ListItem {

  @PrimaryGeneratedColumn('uuid')
  @Field( () => ID )
  id: string;

  @Column({ type: 'numeric' })
  @Field( () => Number )
  quantity: number;

  @Column({ type: 'boolean' })
  @Field( () => Boolean )
  completed: boolean;


  //Relaciones
  //muchos lisItem en cuantas listas pueden aparecer?
  //muchos listItem pueden estar en una lista, o muchas listas pueden estar dentro de un ListItem
  @ManyToOne(() => List, (list) => list.listItem, { lazy: true })
  @Field(() => List)
  list: List;

  //muchos items, y se van asociara un unico articulo en la lista de items
  @ManyToOne(() => Item, (item) => item.listItem, { lazy: true })
  @Field(() => Item)
  item: Item;
}
