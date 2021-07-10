import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComplaintRepository } from './complaint.repository';
import { MessagesController } from './messages.controller';
import { StudentModule } from '../student/student.module';
import { AuthModule } from '../auth/auth.module';
import { MessageRepository } from './message.repository';
import { NotificationModule } from '../notification/notification.module';
import { MessageFactory } from './message.factory';

@Module({
  imports: [
    TypeOrmModule.forFeature([ComplaintRepository, MessageRepository]),
    StudentModule,
    AuthModule,
    NotificationModule],
  providers: [MessagesService, MessageFactory],
  controllers: [MessagesController],
})
export class MessagesModule {
}
