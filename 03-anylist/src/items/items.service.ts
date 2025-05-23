import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateItemInput, UpdateItemInput } from './dto/inputs';
import { Item } from './entities/item.entity';
import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { PaginationArgs } from 'src/common/dto/args/pagination.args';
import { SearchArgs } from 'src/common/dto/args';
@Injectable()
export class ItemsService {
  
  constructor(
    @InjectRepository(Item) 
    private readonly itemsRepository: Repository<Item>,
  ) {}
  
  async create(createItemInput: CreateItemInput, user: User): Promise<Item> {
    //destructurar createItemInput y agregar el usuario (...createItemInput, user)
    const newItem = this.itemsRepository.create({...createItemInput, user});
    await this.itemsRepository.save(newItem);
    return newItem;
  }

  async findAll(user: User, paginationArgs: PaginationArgs, searchArgs: SearchArgs): Promise<Item[]> {
    const { offset, limit } = paginationArgs;
    const { search } = searchArgs;

    const queryBuilder = this.itemsRepository.createQueryBuilder()
      .where(`"userId" = :userId`, { userId: user.id })
      .take(limit)
      .skip(offset);

    if(search)
      queryBuilder.andWhere('LOWER(name) like :name', { name: `%${search.toLowerCase()}%` });  
    // quiero que todo el valor de esa query retorne (getMany)  
    return queryBuilder.getMany();
    
   /*  return this.itemsRepository.find({
      take: limit,
      skip: offset,
      where: {
        user: {
          id: user.id
        },
        name: Like(`%${ search?.toLowerCase() }%`)
      }
    }); */
  }

  async findOne(id: string, user: User): Promise<Item> {
    const item = await this.itemsRepository.findOneBy({
      id,
      user: {
        id: user.id
      }
    });
    if (!item) {
      throw new Error(`Item with id ${id} not found`);
    }

    //item.user = user;
    
    return item;
  }

  async update(id: string, updateItemInput: UpdateItemInput, user: User   ): Promise<Item> {
    await this.findOne(id, user);
    const item = await this.itemsRepository.preload(updateItemInput);
    //const item = await this.itemsRepository.findOneBy({ id });
    if (!item) {
      throw new NotFoundException(`Item with id ${id} not found`);
    }
    //item.name = updateItemInput.name ? updateItemInput.name : item.name;
    //item.quantity = updateItemInput.quantity ? updateItemInput.quantity : item.quantity;
    //item.quantityUnits = updateItemInput.quantityUnits ? updateItemInput.quantityUnits : item.quantityUnits;
    return this.itemsRepository.save(item);
  }

  async remove(id: string, user: User): Promise<Item> {
    const item = await this.findOne(id, user);
    await this.itemsRepository.remove(item);
    return { ...item, id };
  }

  async itemCountByUser(user: User): Promise<number> {
    return this.itemsRepository.count({
      where: {
        user: {
          id: user.id
        }
      }
    });
  }
}
