import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  
  // 글로벌 요청 로깅 미들웨어
  app.use((req, res, next) => {
    console.log('Request:', req.method, req.url, req.headers.authorization);
    next();
  });

  // CORS 설정
  app.enableCors({
    origin: configService.get('FRONTEND_URL'),
    credentials: true,
  });

  // 정적 파일 서빙 설정
  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.use('/uploads', require('express').static(join(__dirname, '..', 'uploads')));

  // Swagger 설정
  const config = new DocumentBuilder()
    .setTitle('API 문서')
    .setDescription('API에 대한 설명')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(configService.get('PORT') || 4000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
