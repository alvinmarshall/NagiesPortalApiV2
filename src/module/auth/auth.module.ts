import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenRepository } from './token.repository';
import { StudentRepository } from '../student/student.repository';
import { TeacherRepository } from '../teacher/teacher.repository';
import { UserDetailService } from './user-detail.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtOptionFactoryService } from './jwt-option-factory.service';
import { JwtStrategy } from './strategy';
import { TokenService } from './token.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TokenRepository,
      StudentRepository,
      TeacherRepository]),
    JwtModule.registerAsync({ useClass: JwtOptionFactoryService }),
  ],
  exports:[AuthService,UserDetailService,PassportModule,JwtStrategy],
  providers: [
    AuthService,
    UserDetailService,
    PassportModule,
    TokenService,
    JwtStrategy],

})
export class AuthModule {
}
