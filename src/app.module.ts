import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UserModule } from './user/user.module'
import { AuthModule } from './auth/auth.module'
import { ConfigModule } from '@nestjs/config'
import { SessionModule } from './session/session.module'
import { QuizModule } from './quiz/quiz.module'
import { ParticipantModule } from './participant/participant.module'
import { AnswerModule } from './answer/answer.module'

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ['.env.local', '.env'] }),
    UserModule,
    AuthModule,
    QuizModule,
    ParticipantModule,
    AnswerModule,
    SessionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
