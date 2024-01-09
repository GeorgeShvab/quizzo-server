import { Module } from '@nestjs/common'
import { SessionController } from './session.controller'
import { SessionService } from './session.service'
import { SessionSocket } from './session.gateway'
import { PrismaService } from 'src/prismaService'
import { AuthService } from 'src/auth/auth.service'
import { JwtService } from '@nestjs/jwt'
import { UserService } from 'src/user/user.service'
import { QuizService } from 'src/quiz/quiz.service'
import { ParticipantService } from 'src/participant/participant.service'
import { AnswerService } from 'src/answer/answer.service'
import { SessionQuestionService } from 'src/session-question/session-question.service'
import { QuestionService } from 'src/question/question.service'

@Module({
  imports: [],
  controllers: [SessionController],
  providers: [
    PrismaService,
    UserService,
    SessionService,
    JwtService,
    AuthService,
    SessionSocket,
    QuizService,
    ParticipantService,
    AnswerService,
    SessionQuestionService,
  ],
})
export class SessionModule {}
