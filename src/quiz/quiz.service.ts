import { Injectable } from '@nestjs/common'
import { Question, Quiz } from '@prisma/client'
import { PrismaService } from 'src/prismaService'

type CreateQuestionParams = Pick<Question, 'title' | 'variants' | 'answer' | 'quizId' | 'position'>

type CreateQuizParams = Pick<Quiz, 'title' | 'ownerId'> & { questions: CreateQuestionParams[] }

@Injectable()
export class QuizService {
  constructor(private readonly PrismaService: PrismaService) {}

  async create(data: CreateQuizParams) {
    return this.PrismaService.quiz.create({
      data: { ...data, questions: { createMany: { data: data.questions } } },
    })
  }

  async get(id: number) {
    return this.PrismaService.quiz.findUnique({
      where: { id },
      include: { questions: { orderBy: { position: 'asc' } } },
    })
  }

  async getByUser(id: number) {
    return this.PrismaService.quiz.findMany({
      where: { ownerId: id },
      include: { questions: { orderBy: { position: 'asc' } } },
    })
  }
}
