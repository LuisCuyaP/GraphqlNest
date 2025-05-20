import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SignupInput } from 'src/auth/dto/inputs/signup.input';
import * as bcrypt from 'bcrypt';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';

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
  async findAll(roles: ValidRoles[]): Promise<User[]> {
    if(roles.length === 0) 
      return this.usersRepository.find({
       // no es necesario ya que en la entidad de user se uso la propiedad lazy
       /*  relations: {
          lastUpdatedBy: true
        } */
      });

    return this.usersRepository.createQueryBuilder()
      .andWhere('ARRAY[roles] && ARRAY[:...roles]')
      .setParameter('roles', roles)
      .getMany();
  }

  async findOneByEmail(email: string): Promise<User> {
    try{
      return await this.usersRepository.findOneOrFail({ where: { email } });
    }catch(error){
      this.handleDBErrors({
        code: 'error-001',
        detail: `User with email ${email} not found`
      });
    }
  }

  async findOneById(id: string): Promise<User> {
    try{
      return await this.usersRepository.findOneOrFail({ where: { id } });
    }catch(error){
      this.handleDBErrors({
        code: 'error-001',
        detail: `User with email ${id} not found`
      });
    }
  }

  update(id: number, updateUserInput: UpdateUserInput) {
    return `This action updates a #${id} user`;
  }

  async block(id: string, adminUser: User): Promise<User> {
    const userToBlock = await this.findOneById(id);
    userToBlock.isActive = false;
    userToBlock.lastUpdatedBy = adminUser;
    return this.usersRepository.save(userToBlock);
  }

  private handleDBErrors(error: any): never {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail.replace('Key', ''));
    }
    if (error.code === 'error-001') {
      throw new BadRequestException(error.detail.replace('Key', ''));
    }
    this.logger.error(error);
    throw new InternalServerErrorException('Please check server logs');
  }
}
