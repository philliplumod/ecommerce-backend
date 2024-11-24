import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { userRole } from '../schema/user.schema';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  @IsIn([userRole.ADMIN, userRole.USER])
  role: string;

  @IsOptional()
  @IsString()
  secretToken?: string;
}
