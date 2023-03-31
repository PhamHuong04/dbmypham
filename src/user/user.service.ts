import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthHelper } from 'src/common/helper/user.helper';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @Inject(AuthHelper)
    private readonly helper: AuthHelper,
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
    createUserDto.password = this.helper.encodePassword(createUserDto.password);
    return this.userRepository.save(createUserDto);
  }

  async findAll() {
    const users = await this.userRepository.findAndCount({});
    if (!users) {
      throw new HttpException('Not found user', HttpStatus.NOT_FOUND);
    }
    return users;
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new HttpException('Not found user', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new HttpException('Not found user', HttpStatus.NOT_FOUND);
    }
    await this.userRepository.update({ id }, updateUserDto);
    return `update successfully`;
  }

  async remove(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new HttpException('Not found user', HttpStatus.NOT_FOUND);
    }
    await this.userRepository.delete(id);
    return `delete successfully`;
  }
}
