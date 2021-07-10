import { UserDetails } from '../auth/interface';
import { MessageBody } from './dto/message.dto';

export abstract class Messenger {
  abstract sendMessage(user: UserDetails, body: MessageBody): Promise<any>

  abstract getMessage(user: UserDetails, pageable: any): Promise<any>

  abstract getSentMessages(user: UserDetails, pageable: any): Promise<any>
}