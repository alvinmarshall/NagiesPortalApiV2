import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {FilesModule} from './module/files/files.module';
import {MessagesModule} from './module/messages/messages.module';
import {StudentModule} from './module/student/student.module';
import {TeacherModule} from './module/teacher/teacher.module';
import {UserModule} from './module/user/user.module';
import {NotificationModule} from './module/notification/notification.module';
import {TypeOrmModule} from "@nestjs/typeorm";
import {config, TypeOrmConfigService} from "./lib";
import {ConfigModule} from "@nestjs/config";
import { AuthModule } from './module/auth/auth.module';
import { AttendanceModule } from './module/attendance/attendance.module';
import { LevelModule } from './module/level/level.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [config]
        }),
        TypeOrmModule.forRootAsync({useClass: TypeOrmConfigService}),
        FilesModule,
        MessagesModule,
        StudentModule,
        TeacherModule,
        UserModule,
        NotificationModule,
        AuthModule,
        AttendanceModule,
        LevelModule
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
