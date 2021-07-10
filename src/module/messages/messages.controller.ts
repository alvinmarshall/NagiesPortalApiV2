import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/decorator';
import { UserDetails } from '../auth/interface';
import { MessageBody, MessageQuery, RecipientQuery } from './dto/message.dto';
import { MessageFactory } from './message.factory';

@Controller('messages')
export class MessagesController {
  constructor(
    private readonly messageService: MessagesService,
    private readonly messageFactory: MessageFactory) {
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async sendMessage(
    @GetUser() user: UserDetails,
    @Query() recipientType: RecipientQuery,
    @Body() body: MessageBody) {
    return this.messageFactory.sendMessage(recipientType.to, user, body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getMessage(
    @GetUser() user: UserDetails,
    @Query() messageQuery: MessageQuery) {
    return this.messageFactory.getMessage(messageQuery.from, user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/sent')
  async getSentMessage(
    @GetUser() user: UserDetails) {
    return this.messageFactory.getSentMessages(user.role, user);
  }
}
