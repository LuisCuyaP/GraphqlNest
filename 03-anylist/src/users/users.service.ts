import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SignupInput } from 'src/auth/dto/inputs/signup.input';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {

  private logger = new Logger('UsersService');

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>
  ) {}

  async create(signupInput: SignupInput): Promise<User> {
    try {
      const newUser = this.usersRepository.create({
        ...signupInput,
        password: bcrypt.hashSync(signupInput.password, 10)
      });
      await this.usersRepository.save(newUser);
      return newUser;
    } catch (error) {
      this.handleDBErrors(error);
    }
  }
  async findAll(): Promise<User[]> {
    return [];
  }

  findOne(id: string): Promise<User> {
    throw new Error(`This action returns a #${id} user`);
  }

  update(id: number, updateUserInput: UpdateUserInput) {
    return `This action updates a #${id} user`;
  }

  block(id: string): Promise<User> {
    throw new Error(`This action returns a #${id} user`);
  }

  private handleDBErrors(error: any): never {
    if (error.code === '23505') {
      throw new Error(error.detail.replace('Key', ''));
    }

    this.logger.error(error);

    throw new InternalServerErrorException('Please check server logs');
  }
}
