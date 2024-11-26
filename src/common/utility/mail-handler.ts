import FormData from 'form-data';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

const configService = new ConfigService();

export const sendEmail = async (
  to: string,
  subject: string,
  templateName: string,
  data: Record<string, any> = {},
) => {
  try {
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

    const response = await axios({
      method: 'post',
      url: `https://api.mailgun.net/v3/${configService.get<string>('TEST_DOMAIN')}/messages`,
      headers: {
        Authorization: `Basic ${token}`,
        contentType: 'multipart/form-data',
      },
      data: form,
    });
    return response;
  } catch (error) {
    throw new Error('Error while sending email');
  }
};
