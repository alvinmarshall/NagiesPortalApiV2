import { UserDetails } from '../auth/interface';
import { MessageBody } from './dto/message.dto';
import { MessagesService } from './messages.service';
import { AuthType } from '../../lib/common';
import { BadRequestException } from '@nestjs/common';
import { Messenger } from './messenger';

export class ParentMessage extends Messenger {
  constructor(private readonly messageService: MessagesService) {
    super();
  }

  async sendMessage(user: UserDetails, body: MessageBody) {
    if (user.role != AuthType.PARENT)
      return new BadRequestException('Only parent can send complaints');
    return this.messageService.sendComplaint(user, body);
  }

  getMessage(user: UserDetails, pageable: any): Promise<any> {
    return this.messageService.getMessages(user);
  }

  getSentMessages(user: UserDetails, pageable: any): Promise<any> {
    return this.messageService.getComplaints(user);
  }


}