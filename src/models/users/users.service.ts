import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { compare, hash } from 'bcrypt';
import { userRole } from './schema/user.schema';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from './user.repository';
import { sendEmail } from 'src/common/utility/mail-handler';
import { generateAuthToken } from 'src/common/utility/token-generator';

const configService = new ConfigService();

@Injectable()
export class UsersService {
  constructor(
    @Inject(UserRepository) private readonly userMongoDB: UserRepository,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const hashedPassword = await hash(createUserDto.password, 10);

      if (
        createUserDto.role === userRole.ADMIN &&
        createUserDto.secretToken ===
          configService.get<string>('ADMIN_SECRET_TOKEN')
      ) {
        throw new Error('Not allowed to create admin');
      } else {
        createUserDto.isVerified = true;
      }

      const user = await this.userMongoDB.findOne({
        email: createUserDto.email,
      });
      if (user) {
        throw new Error('User already exists');
      }
//https://youtu.be/wwktn2EafpM
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
        await sendEmail(
          newUser.email,
          configService.get<string>('VERIFY_EMAIL_TEMPLATE'),
          'Verify Email',
          {
            customerName: newUser.name,
            customerEmail: newUser.email,
            otp,
          },
        );
      }

      return {
        success: true,
        message:
          newUser.role === userRole.ADMIN
            ? 'Admin created'
            : 'Please activate your account by verifying your email. OTP sent to your email',
        result: { email: newUser.email },
      };
    } catch (error) {
      throw new InternalServerErrorException('Error while creating user');
    }
  }

  async login(email: string, password: string) {
    try {
      const userExists = await this.userMongoDB.findOne({
        email,
      });
      if (!userExists) {
        throw new Error('User not found');
      }
      if (!userExists.isVerified) {
        throw new Error('Please verify your account');
      }
      const isPasswordMatched = userExists.password === password;
      if (!isPasswordMatched) {
        throw new Error('Incorrect password');
      }
      const token = await generateAuthToken(userExists.id);
      return {
        success: true,
        message: 'Login successful',
        result: {
          user: {
            name: userExists.name,
            email: userExists.email,
            role: userExists.role,
          },
          token,
        },
      };
    } catch (error) {}
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
