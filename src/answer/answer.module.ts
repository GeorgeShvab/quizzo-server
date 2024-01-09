import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prismaService'
import { AnswerService } from './answer.service'

@Module({ imports: [], controllers: [], providers: [PrismaService, AnswerService] })
export class AnswerModule {}
