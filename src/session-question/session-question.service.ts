import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prismaService'

interface CreateSessionQuestionParams {
  sessionId: number
  questionId: number
}

@Injectable()
export class SessionQuestionService {
  constructor(private readonly PrismaService: PrismaService) {}

  async create(data: CreateSessionQuestionParams) {
    return this.PrismaService.sessionQuestion.create({ data })
  }

  async get(id: number) {
    return this.PrismaService.sessionQuestion.findUnique({ where: { id }, include: { question: true } })
  }

  async getBySession(sessionId: number) {
    return this.PrismaService.sessionQuestion.findMany({ where: { sessionId }, include: { question: true } })
  }
}
