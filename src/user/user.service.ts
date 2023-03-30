import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  private logger = new Logger('UserService');

  async create(createUserDto: CreateUserDto) {
    const user: User = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (user) {
      throw new HttpException(
        'This user already exists in the system',
        HttpStatus.CONFLICT,
      );
    }
    this.logger.verbose(
      `New user in system with email is: ${createUserDto.email.toLowerCase()}`,
    );
    return this.userRepository.save(createUserDto);
  }

  async findAll() {
    const users = await this.userRepository.findAndCount({});
    if (!users) {
      throw new HttpException('Not found user', HttpStatus.NOT_FOUND);
    }
    return users;
  }

  findOne(id: number) {
    return this.userRepository.findOne({
      where: {
        id,
      },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    });
    if (!user) {
      throw new NotFoundException(`User with ID: ${id} not found`);
    }
    await this.userRepository.update(id, updateUserDto);
    return `update successfully`;
  }

  async remove(id: number) {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    });
    if (!user) {
      throw new NotFoundException(`User with ID: ${id} not found`);
    }
    await this.userRepository.delete(id);
    return `delete successfully`;
  }
}
