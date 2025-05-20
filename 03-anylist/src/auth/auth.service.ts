import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthResponse } from './types/auth-response.type';
import { UsersService } from 'src/users/users.service';
import { LoginInput, SignupInput } from './dto/inputs';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {    
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService
    ){}

    private getJwtToken(userId: string){
        return this.jwtService.sign({ id: userId });
    }

    async signup(signupInput: SignupInput): Promise<AuthResponse>{
        const user = await this.usersService.create(signupInput);
        const token = this.getJwtToken(user.id);
        return { token, user };
    }

    async login(loginInput: LoginInput): Promise<AuthResponse>{
        const user = await this.usersService.findOneByEmail(loginInput.email);
        
        if(!bcrypt.compareSync(loginInput.password, user.password!))
            throw new BadRequestException('Password is incorrect');

        const token = this.getJwtToken(user.id);        
        return { token, user };
    }

    async validateUser(id: string): Promise<User>{
        const user = await this.usersService.findOneById(id);
        if(!user.isActive)
            throw new BadRequestException(`User with id ${id} is not active`);
        delete user.password;
        console.log(user);
        return user;
    }

}
