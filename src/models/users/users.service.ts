import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { hash } from 'crypto';
import { userRole } from './schema/user.schema';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from './user.repository';

const configService = new ConfigService();

@Injectable()
export class UsersService {
  constructor(
    @Inject(UserRepository) private readonly userMongoDB: UserRepository,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      // generate hashed password
      const hashedPassword = await hash(createUserDto.password, 'sha256');

      if (
        createUserDto.role === userRole.ADMIN &&
        createUserDto.secretToken ===
          configService.get<string>('ADMIN_SECRET_TOKEN')
      ) {
        throw new Error('Not allowed to create admin');
      } else {
        createUserDto.isVerified = true;
      }

      // check if user already exists
      const user = await this.userMongoDB.findOne({
        email: createUserDto.email,
      });
      if (user) {
        throw new Error('User already exists');
      }

      const otp = Math.floor(100000 + Math.random() * 900000);
      const otpExpiryTime = new Date();
      otpExpiryTime.setMinutes(otpExpiryTime.getMinutes() + 5);

      const newUser = await this.userMongoDB.create({
        ...createUserDto,
        password: hashedPassword,
        otp,
        otpExpiryTime,
      });

      if (newUser.role !== userRole.ADMIN) {
        sendEmail(newUser.email, otp);
      }

      return {
        success: true,
        message: 'User created successfully',
        result: { email: newUser.email },
      };
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
