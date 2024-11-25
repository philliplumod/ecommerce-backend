import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { hash } from 'crypto';
import { userRole } from './schema/user.schema';
import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();

@Injectable()
export class UsersService {
  async create(createUserDto: CreateUserDto) {
    try {
      const hashedPassword = await hash(createUserDto.password, 'sha256');

      if (
        createUserDto.role === userRole.ADMIN &&
        createUserDto.secretToken ===
          configService.get<string>('ADMIN_SECRET_TOKEN')
      ) {
        return 'User created successfully';
      }
    } catch (error) {
      throw new InternalServerErrorException('Error while creating user');
    }
  }

  login(email: string, password: string) {
    return 'This action logs in a user';
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
