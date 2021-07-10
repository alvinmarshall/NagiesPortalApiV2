import { AuthType, MessageType, RecipientType } from '../../lib/common';
import { ParentMessage } from './parent.message';
import { TeacherMessage } from './teacher.message';
import { UserDetails } from '../auth/interface';
import { MessageBody } from './dto/message.dto';
import { MessagesService } from './messages.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MessageFactory {
  private actions: {};

  constructor(private readonly messageService: MessagesService) {
    const parentMessage = new ParentMessage(messageService);
    const teacherMessage = new TeacherMessage(messageService);

    this.actions = {
      [RecipientType.TEACHER]: () => parentMessage, //complaint
      [RecipientType.PARENT]: () => teacherMessage, // general message
      [MessageType.COMPLAINT]: () => teacherMessage, // get complaint
      [MessageType.MESSAGE]: () => parentMessage, // get general message
      [AuthType.PARENT]: () => parentMessage,
      [AuthType.TEACHER]: () => teacherMessage,
    };

  }

  async sendMessage(recipient: RecipientType, user: UserDetails, payload: MessageBody) {
    return this.actions[recipient]().sendMessage(user, payload);
  }

  async getMessage(messageType: MessageType, user: UserDetails) {
    return this.actions[messageType]().getMessage(user, null);
  }

  async getSentMessages(authType: AuthType, user: UserDetails) {
    return this.actions[authType]().getSentMessages(user, null);
  }

}