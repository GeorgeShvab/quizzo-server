import { Injectable } from '@nestjs/common'
import { Answer } from '@prisma/client'
import { PrismaService } from 'src/prismaService'

type CreateAnswerParams = Pick<Answer, 'participantId' | 'questionId' | 'sessionId' | 'answer'>

@Injectable()
export class AnswerService {
  constructor(private readonly PrismaService: PrismaService) {}

  async create(data: CreateAnswerParams) {
    return this.PrismaService.answer.create({ data })
  }

  async getByParticipant(id: number) {
    return this.PrismaService.answer.findMany({ where: { participantId: id } })
  }

  async getBySession(id: number) {
    return this.PrismaService.answer.findMany({ where: { sessionId: id }, include: { question: true } })
  }
}
