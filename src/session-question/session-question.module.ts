import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prismaService'
import { SessionQuestionService } from './session-question.service'

@Module({ imports: [], controllers: [], providers: [PrismaService, SessionQuestionService] })
export class SessionQuestionModule {}
