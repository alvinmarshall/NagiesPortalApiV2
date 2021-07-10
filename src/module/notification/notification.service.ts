import * as admin from 'firebase-admin';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NotificationService {
  constructor(private readonly configService: ConfigService) {
  }

  async sendTopicMessage(data) {
    return admin.messaging()
      .sendToTopic(this.getTopic(data.topic), data);
  }

  private getTopic(topic: string): string {
    return this.configService.get('env') === 'development'
      ? `dev_${topic}` : topic;
  }
}
