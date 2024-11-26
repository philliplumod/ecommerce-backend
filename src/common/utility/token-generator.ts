import { ConfigService } from '@nestjs/config';
import jwt from 'jsonwebtoken';

const configService = new ConfigService();

export const generateAuthToken = (id: string) => {
  return jwt.sign({ id }, configService.get('JWT_TOKEN_SECRET'), { expiresIn: '1d' });
};

export const decodeAuthToken = (token: string) => {

    
};