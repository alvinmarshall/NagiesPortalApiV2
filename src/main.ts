import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import {
  initializeTransactionalContext,
  patchTypeORMRepositoryWithBaseRepository,
} from 'typeorm-transactional-cls-hooked';
import { CustomExceptionFilter } from './lib/exception';
import * as admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.useGlobalFilters(new CustomExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());
  initializeTransactionalContext(); // Initialize cls-hooked
  patchTypeORMRepositoryWithBaseRepository(); // patch Repository with BaseRepository.

  const adminConfig: ServiceAccount = {
    'projectId': configService.get<string>('firebase.projectId'),
    'privateKey': configService.get<string>('firebase.privateKey')
      .replace(/\\n/g, '\n'),
    'clientEmail': configService.get<string>('firebase.clientEmail'),
  };
  // Initialize the firebase admin app
  admin.initializeApp({
    credential: admin.credential.cert(adminConfig),
    databaseURL: configService.get('firebase.databaseURL'),
  });


  const port = configService.get<number>('port');
  await app.listen(port);
}

bootstrap();
