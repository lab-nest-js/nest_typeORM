import { User } from './entities/user.entity';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { HashService } from 'src/hash/hash.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private hashService: HashService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      if (createUserDto.password) {
        createUserDto.password = await this.hashService.hash(
          createUserDto.password,
        );
      }
      const user = await this.userRepository.create(createUserDto);
      const savedUser = await this.userRepository.save(user);
      delete savedUser.password;
      return savedUser;
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('User already exists');
      }
      throw new InternalServerErrorException(error);
    }
  }

  async findAll() {
    const users = await this.userRepository.find();
    users.forEach((user) => {
      delete user.password;
    });
    return users;
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    delete user.password;
    return user;
  }

  async findByEmail(email: string, deletePassword = false) {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new NotFoundException(`User #${email} not found`);
    }
    if (deletePassword) {
      delete user.password;
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      updateUserDto.password = await this.hashService.hash(
        updateUserDto.password,
      );
    }
    const user = await this.findOne(id);
    const updatedUser = await this.userRepository.update(id, updateUserDto);
    if (!updatedUser.affected) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return user;
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    const deletedUser = await this.userRepository.delete(id);
    if (!deletedUser.affected) {
      throw new NotFoundException("User couldn't be deleted");
    }
    return user;
  }
}
