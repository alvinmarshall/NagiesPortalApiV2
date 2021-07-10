import { UserDetails } from '../auth/interface';
import { MessageBody } from './dto/message.dto';
import { MessagesService } from './messages.service';
import { Messenger } from './messenger';

export class TeacherMessage extends Messenger {
  constructor(private readonly messageService: MessagesService) {
    super();
  }

  async sendMessage(user: UserDetails, body: MessageBody): Promise<any> {
    return this.messageService.sendMessage(user, body);
  }

  getMessage(user: UserDetails, pageable: any): Promise<any> {
    return this.messageService.getComplaints(user);
  }

  getSentMessages(user: UserDetails, pageable: any): Promise<any> {
    return this.messageService.getSentMessages(user);
  }

}