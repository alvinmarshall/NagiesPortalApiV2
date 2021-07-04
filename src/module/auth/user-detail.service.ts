import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { StudentRepository } from '../student/student.repository';
import { UserDetails } from './interface';
import { UserNotFoundException } from '../../lib/exception';
import { AuthType } from '../../lib/common';
import { TeacherRepository } from '../teacher/teacher.repository';
import { UserProfile } from '../user/dto/user-profile.dto';

@Injectable()
export class UserDetailService {
  constructor(
    @InjectRepository(StudentRepository)
    private readonly studentRepository: StudentRepository,
    @InjectRepository(TeacherRepository)
    private readonly teacherRepository: TeacherRepository) {
  }

  async getUser(referenceNo: string, role: AuthType): Promise<UserDetails> {
    switch (role) {
      case AuthType.PARENT:
        return this.getStudent(referenceNo);
      case AuthType.TEACHER:
        return this.getTeacher(referenceNo);
    }

  }

  async getUserByCredential(cred: { username: string, password: string, role: AuthType }): Promise<UserDetails> {
    switch (cred.role) {
      case AuthType.PARENT:
        return this.getStudentByCredential(cred);
      case AuthType.TEACHER:
        return this.getTeacherByCredential(cred);
    }

  }

  async getUserProfile(referenceNo: string, role: AuthType): Promise<UserProfile> {
    switch (role) {
      case AuthType.PARENT:
        return this.getStudentProfile(referenceNo);
      case AuthType.TEACHER:
        return this.getTeacherProfile(referenceNo);
    }

  }

  private async getStudent(referenceNo: string): Promise<UserDetails> {
    const user = await this.studentRepository.findByReferenceNumber(referenceNo);
    const errorMsg = `student with reference number: ${referenceNo} not found`;
    if (!user) throw new UserNotFoundException(errorMsg);
    return {
      id: user.id,
      role: AuthType.PARENT,
      username: user.indexNo,
      name: user.studentsName,
      ref: user.studentsNo,
      level: user.levelName,
      imageUrl: user.image,
      faculty: user.facultyName,
    };
  }


  private async getStudentProfile(referenceNo: string): Promise<UserProfile> {
    const user = await this.studentRepository.findByReferenceNumber(referenceNo);
    const errorMsg = `student with reference number: ${referenceNo} not found`;
    if (!user) throw new UserNotFoundException(errorMsg);
    return {
      name: user.studentsName,
      ref: user.studentsNo,
      level: user.levelName,
      imageUrl: user.image,
      faculty: user.facultyName,
      admissionDate: user.adminDate,
      contact: user.guardianNo,
      dob: user.dob,
      gender: user.gender,
      guardian: user.guardianName,
      index: user.indexNo,
      section: user.sectionName,
      semester: user.semesterName,

    };
  }

  private async getStudentByCredential(cred: { username: string, password: string }): Promise<UserDetails> {
    const user = await this.studentRepository.findOne({ indexNo: cred.username, password: cred.password });
    const errorMsg = `student with index: ${cred.username} not found`;
    if (!user) throw new UserNotFoundException(errorMsg);
    return {
      id: user.id,
      role: AuthType.PARENT,
      username: user.indexNo,
      name: user.studentsName,
      ref: user.studentsNo,
      level: user.levelName,
      imageUrl: user.image,
      faculty: user.facultyName,
    };
  }

  private async getTeacher(referenceNo: string): Promise<UserDetails> {
    const user = await this.teacherRepository.findByReferenceNumber(referenceNo);
    const errorMsg = `teacher with reference number: ${referenceNo} not found`;
    if (!user) throw new UserNotFoundException(errorMsg);
    return {
      id: user.id,
      ref: user.teachersNo,
      level: user.levelName,
      role: AuthType.TEACHER,
      username: user.username,
      name: user.teachersName,
      imageUrl: user.image,
      faculty: user.facultyName,
    };
  }

  private async getTeacherProfile(referenceNo: string): Promise<UserProfile> {
    const user = await this.teacherRepository.findByReferenceNumber(referenceNo);
    const errorMsg = `teacher with reference number: ${referenceNo} not found`;
    if (!user) throw new UserNotFoundException(errorMsg);
    return {
      ref: user.teachersNo,
      level: user.levelName,
      name: user.teachersName,
      imageUrl: user.image,
      faculty: user.facultyName,
      admissionDate: user.adminDate,
      dob: user.dob,
      contact: user.contact,
      gender: user.gender,
    };
  }

  private async getTeacherByCredential(cred: { username: string, password: string }): Promise<UserDetails> {
    const user = await this.teacherRepository.findOne({ username: cred.username, password: cred.password });
    const errorMsg = `teacher with username: ${cred.username} not found`;
    if (!user) throw new UserNotFoundException(errorMsg);
    return {
      id: user.id,
      ref: user.teachersNo,
      level: user.levelName,
      role: AuthType.TEACHER,
      username: user.username,
      name: user.teachersName,
      imageUrl: user.image,
      faculty: user.facultyName,
    };
  }
}