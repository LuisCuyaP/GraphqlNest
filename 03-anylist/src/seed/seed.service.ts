import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { read } from 'fs';
import { Item } from 'src/items/entities/item.entity';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { SEED_ITEMS, SEED_LISTS, SEED_USERS } from './data/seed-data';
import { ItemsService } from 'src/items/items.service';
import { CreateItemInput } from 'src/items/dto/inputs';
import { ListItem } from 'src/list-item/entities/list-item.entity';
import { List } from 'src/lists/entities/list.entity';
import { ListsService } from 'src/lists/lists.service';
import { ListItemService } from 'src/list-item/list-item.service';
import { CreateListInput } from 'src/lists/dto/create-list.input';

@Injectable()
export class SeedService {

    private isProd: boolean;

    constructor(
        private readonly configService: ConfigService,
        
        @InjectRepository(Item)
        private readonly itemsRepository: Repository<Item>,
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
        @InjectRepository(ListItem)
        private readonly listItemsRepository: Repository<ListItem>,
        @InjectRepository(List)
        private readonly listsRepository: Repository<List>,

        private readonly usersService: UsersService,
        private readonly itemsService: ItemsService,
        private readonly listsService: ListsService,
        private readonly listItemService: ListItemService,

    ){
        this.isProd = this.configService.get('STATE') === 'prod';
    }

    async executeSeed() {
        if(this.isProd)
            throw new UnauthorizedException('No se puede ejecutar el seed en produccion');
        await this.deleteDatabase();
        const user = await this.loadUsers();
        await this.loadItems(user);
        const list = await this.loadLists(user);
        const items = await this.itemsService.findAll(user, {  limit: 15, offset: 0 }, { search: '' });
        await this.loadListsItems(list, items);
        
        return true;
    }

    async deleteDatabase(){
        await this.listItemsRepository.createQueryBuilder()
            .delete()
            .where({})
            .execute();
            
        await this.listsRepository.createQueryBuilder()
            .delete()
            .where({})
            .execute();

        await this.itemsRepository.createQueryBuilder()
            .delete()
            .where({})
            .execute();

        await this.usersRepository.createQueryBuilder()
            .delete()
            .where({})
            .execute();
    }

    async loadUsers(): Promise<User> {
        const users: User[] = [];
        for (const user of SEED_USERS ) {
            users.push(await this.usersService.create(user))
        }
        return users[0];
    }

    async loadItems(user: User): Promise<void> {
        const itemsPromises: Promise<Item>[] = [];
      
        for (const seedItem of SEED_ITEMS) {
          const createItemInput: CreateItemInput = {
            name: seedItem.name,
            quantityUnits: seedItem.quantityUnits ?? undefined
          };
      
          itemsPromises.push(this.itemsService.create(createItemInput, user));
        }
        await Promise.all(itemsPromises);
    }

    async loadLists(user: User): Promise<List> {
        const lists: List[] = [];
        for(const list of SEED_LISTS){
            lists.push(await this.listsService.create(list, user));
        }
        return lists[0];
    }

    async loadListsItems(list: List, items: Item[]) {
        for (const item of items) {
            this.listItemService.create({
                quantity: Math.round(Math.random() * 10),
                completed: Math.round(Math.random() * 1) === 0 ? false: true,
                listId: list.id,
                itemId: item.id
            });
        }
    }
}