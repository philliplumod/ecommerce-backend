import Mailgun from 'mailgun.js';
import FormData from 'form-data';
import { ConfigService } from '@nestjs/config';
import { config } from 'process';

const configService = new ConfigService();

export const sendEmail = async (
  to: string,
  subject: string,
  templateName: string,
  data: Record<string, any> = {},
) => {
  const form = new FormData();
  form.append('to', to);
  form.append('subject', subject);
  form.append('template', templateName);
  Object.keys(data).forEach((key) => {});
  form.append('from', configService.get<string>('TEST_DOMAIN'));
  Object.keys(data).forEach((key) => {
    form.append(`v:${key}`, data[key]);
  });

  const userName = 'api';
  const password = configService.get<string>('PRIVATE_API_KEY');

  const token = Buffer.from(`${userName}:${password}`).toString('base64');

  const respone = await axios({
    method: 'post',
    url: `https://api.mailgun.net/v3/${configService.get<string>('TEST_DOMAIN')}/messages`,
    headers: {},
  });
};
