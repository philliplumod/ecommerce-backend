import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ResponseInterceptor } from './common/serializers/responseInterceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const configService = new ConfigService();

const port = configService.get<number>('PORT');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Set up Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('E-commerce API')
    .setDescription('API for an e-commerce application')
    // .addBearerAuth({ in: 'header', type: 'http' }) // Bearer token for authentication
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  //Port to listen on
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}/api`);
}
bootstrap();
