import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma/prisma.service';
import { CourseModule } from './course/course.module';
import { ContentModule} from './content/content.module';
import { EnrollmentModule } from './enrollment/enrollment.module';
import { ProgressModule } from './progress/progress.module';
import { QuizModule } from './qiuz/qiuz.module';
import { ReviewModule } from './review/review.module';
import { AdminModule } from './admin/admin.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { CertificatesModule } from './certificates/certificates.module';
import { LessonModule } from './lesson/lesson.module';
import { UserModule } from './user/user.module';
import { QuestionModule } from './question/question.module';
// import { TaskAnswersModule } from './task-answers/task-answers.module';
import { MailerModule } from '../Utils/mailermodule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MailerModule,
    AuthModule,  
    CourseModule, 
    ContentModule, 
    EnrollmentModule, 
    ProgressModule, 
    QuizModule, 
    ReviewModule, 
    AdminModule, 
    AnalyticsModule, 
    CertificatesModule, 
    LessonModule, 
    UserModule, 
    QuestionModule
    // TaskAnswersModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
