import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prismaService'
import { QuestionService } from './question.service'

@Module({ imports: [], controllers: [], providers: [PrismaService, QuestionService] })
export class QuestionModule {}
