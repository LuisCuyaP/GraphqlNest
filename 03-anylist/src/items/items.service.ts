import { Injectable } from '@nestjs/common';
import { CreateItemInput, UpdateItemInput } from './dto/inputs';
import { Item } from './entities/item.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
@Injectable()
export class ItemsService {
  
  constructor(
    @InjectRepository(Item) 
    private readonly itemsRepository: Repository<Item>,
  ) {}
  
  async create(createItemInput: CreateItemInput): Promise<Item> {
    const newItem = this.itemsRepository.create(createItemInput);
    await this.itemsRepository.save(newItem);
    return newItem;
  }

  async findAll(): Promise<Item[]> {
    return this.itemsRepository.find();
  }

  async findOne(id: string): Promise<Item> {
    const item = await this.itemsRepository.findOneBy({id});
    if (!item) {
      throw new Error(`Item with id ${id} not found`);
    }
    return item;
  }

  async update(id: string, updateItemInput: UpdateItemInput): Promise<Item> {
    //const item = await this.itemsRepository.preload(updateItemInput);
    const item = await this.itemsRepository.findOneBy({ id });
    if (!item) {
      throw new Error(`Item with id ${id} not found`);
    }
    item.name = updateItemInput.name ? updateItemInput.name : item.name;
    item.quantity = updateItemInput.quantity ? updateItemInput.quantity : item.quantity;
    item.quantityUnits = updateItemInput.quantityUnits ? updateItemInput.quantityUnits : item.quantityUnits;
    return this.itemsRepository.save(item);
  }

  async remove(id: string): Promise<Item> {
    const item = await this.findOne(id);
    await this.itemsRepository.remove(item);
    return { ...item, id };
  }
}
