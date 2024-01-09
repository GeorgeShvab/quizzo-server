import { Injectable } from '@nestjs/common'
import { Question } from '@prisma/client'
import { PrismaService } from 'src/prismaService'

type CreateQuestionParams = Pick<Question, 'title' | 'variants' | 'answer' | 'quizId' | 'position'>

@Injectable()
export class QuestionService {
  constructor(private readonly PrismaService: PrismaService) {}

  async create(data: CreateQuestionParams) {
    return this.PrismaService.question.create({ data })
  }

  async delete(id: number) {
    return this.PrismaService.question.delete({ where: { id } })
  }

  async deleteByQuiz(id: number) {
    return this.PrismaService.question.deleteMany({ where: { quizId: id } })
  }
}
