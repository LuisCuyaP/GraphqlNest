import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { ListItem } from 'src/list-item/entities/list-item.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'items' })
@ObjectType()
export class Item {
  
  @PrimaryGeneratedColumn('uuid')
  @Field(()=> ID)
  id: string;

  @Column()
  @Field(()=> String)
  name: string;

/*   @Column()
  @Field(()=> Float)
  quantity: number;
 */
  @Column({ nullable: true })
  @Field(()=> String, { nullable: true })
  quantityUnits?: string; // g, ml, kg, tsp

  // primer paso. add relacion item com usuario
  // muchos item pertenecen a un usuario
  @ManyToOne(() => User, (user) => user.items, { nullable: false, lazy: true })
  @Index('userId-index')
  @Field(() => User)
  user: User;

  //un item como se relacion con listItem?
  //este item puede estar muchas veces en listItem
  //muchos listItem puede estar con este item
  @OneToMany(() => ListItem, (listItem) => listItem.item, { lazy: true })
  @Field(() => [ListItem])
  listItem: ListItem[];
}
