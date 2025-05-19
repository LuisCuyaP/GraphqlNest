import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthResponse } from './types/auth-response.type';
import { UsersService } from 'src/users/users.service';
import { LoginInput, SignupInput } from './dto/inputs';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {    
    constructor(
        private readonly usersService: UsersService
    ){}

    async signup(signupInput: SignupInput): Promise<AuthResponse>{
        const user = await this.usersService.create(signupInput);
        const token = 'ABC123';
        return { user, token };
    }

    async login(loginInput: LoginInput): Promise<AuthResponse>{
        const user = await this.usersService.findOneByEmail(loginInput.email);
        if(!bcrypt.compareSync(loginInput.password, user.password))
            throw new BadRequestException('Password is incorrect');

        return { user, token: 'ABC123' };
    }
}
