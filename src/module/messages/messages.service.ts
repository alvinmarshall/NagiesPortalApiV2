import { Injectable } from '@nestjs/common';
import { UserDetails } from '../auth/interface';
import { InjectRepository } from '@nestjs/typeorm';
import { ComplaintRepository } from './complaint.repository';
import { ComplaintsEntity, MessageEntity } from '../../entities';
import { StudentService } from '../student/student.service';
import { CreateComplaint, CreateMessage } from './dto/message.dto';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { MessageRepository } from './message.repository';
import { NotificationService } from '../notification/notification.service';
import { DataPayload, TopicPayload } from '../notification/dto/firebase.dto';
import { FirebaseTopic } from '../../lib/common';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(ComplaintRepository)
    private readonly complaintRepository: ComplaintRepository,
    @InjectRepository(MessageRepository)
    private readonly messageRepository: MessageRepository,
    private readonly studentService: StudentService,
    private readonly notificationService: NotificationService) {
  }

  @Transactional()
  async sendComplaint(user: UserDetails, body: CreateComplaint) {
    const complaintsEntity = new ComplaintsEntity();
    const student = await this.studentService.getStudent(user.ref);
    complaintsEntity.message = escape(body.message);
    complaintsEntity.studentsNo = user.ref;
    complaintsEntity.studentsName = user.name;
    complaintsEntity.guardianName = student.guardianName;
    complaintsEntity.guardianNo = student.guardianNo;
    complaintsEntity.teachersName = body.teacherName;
    complaintsEntity.levelName = user.level;

    const result = await this.complaintRepository.save(complaintsEntity);
    if (!result) return;
    const dataPayload: DataPayload = {
      title: `${student.guardianName} sent you a complain message`,
      name: body.teacherName,
      type: 'complaint',
      body: body.message,
      image: '',
      level: user.level,
      topic: FirebaseTopic.TEACHER,
    };
    const topicPayload = new TopicPayload(dataPayload);
    return this.notificationService.sendTopicMessage(topicPayload.getPayload());
  }

  @Transactional()
  async sendMessage(user: UserDetails, body: CreateMessage) {
    const messageEntity = new MessageEntity();
    messageEntity.messageLevel = user.level;
    if (body.target_name) {
      if (body.target_id) {
        messageEntity.messageLevel = body.target_id;
      }
    }
    messageEntity.mRead = 0;
    messageEntity.message = escape(body.message);
    messageEntity.messageBy = user.username;

    const result = await this.messageRepository.save(messageEntity);
    if (!result) return;
    const dataPayload: DataPayload = {
      title: `${user.username} sent you a message`,
      name: user.name,
      type: 'message',
      body: body.message,
      image: '',
      level: user.level,
      topic: FirebaseTopic.PARENT,
    };
    const topicPayload = new TopicPayload(dataPayload);
    return this.notificationService.sendTopicMessage(topicPayload.getPayload());
  }


  async getComplaints(user: UserDetails) {
    const complaints = await this.complaintRepository.find({ levelName: user.level });
    return complaints.map(value => {
      value.message = unescape(value.message);
      return value;
    });
  }

  async getSentComplaints(user: UserDetails) {
    const complaints = await this.complaintRepository.find({ studentsNo: user.ref });
    return complaints.map(value => {
      value.message = unescape(value.message);
      return value;
    });
  }

  async getMessages(user: UserDetails) {
    const messages = await this.messageRepository.find({ where: [{ messageLevel: user.level }, { messageLevel: user.ref }] });
    return messages.map(value => {
      value.message = unescape(value.message);
      return value;
    });
  }

  async getSentMessages(user: UserDetails) {
    const messages = await this.messageRepository.find({ where: { messageBy: user.username } });
    return messages.map(value => {
      value.message = unescape(value.message);
      return value;
    });
  }
}
