import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SeedService {

    private isProd: boolean;

    constructor(
        private readonly configService: ConfigService
    ){
        this.isProd = this.configService.get('STATE') === 'prod';
    }

    async executeSeed() {
        if(this.isProd)
            throw new UnauthorizedException('No se puede ejecutar el seed en produccion');
        
        
        
        
        return true;
    }
}
