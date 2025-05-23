import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { read } from 'fs';
import { Item } from 'src/items/entities/item.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SeedService {

    private isProd: boolean;

    constructor(
        private readonly configService: ConfigService,
        @InjectRepository(Item)
        private readonly itemsRepository: Repository<Item>,
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>

    ){
        this.isProd = this.configService.get('STATE') === 'prod';
    }

    async executeSeed() {
        if(this.isProd)
            throw new UnauthorizedException('No se puede ejecutar el seed en produccion');
        await this.deleteDatabase();
        
        
        
        return true;
    }

    async deleteDatabase(){
        await this.itemsRepository.createQueryBuilder()
            .delete()
            .where({})
            .execute();

        await this.usersRepository.createQueryBuilder()
            .delete()
            .where({})
            .execute();
    }
}
