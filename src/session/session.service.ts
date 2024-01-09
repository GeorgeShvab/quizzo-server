import { Injectable } from '@nestjs/common'
import { Session } from '@prisma/client'
import { PrismaService } from 'src/prismaService'

type CreateSessionParams = Pick<Session, 'quizId' | 'ownerId'>

@Injectable()
export class SessionService {
  constructor(private readonly PrismaService: PrismaService) {}

  async create(data: CreateSessionParams) {
    return this.PrismaService.session.create({ data })
  }

  async get(id: number) {
    return this.PrismaService.session.findUnique({
      where: { id },
      include: { quiz: { include: { questions: { orderBy: { position: 'asc' } } } } },
    })
  }

  async update(data: Partial<Session> & { id: number }) {
    return this.PrismaService.session.update({ where: { id: data.id }, data })
  }

  async delete(id: number) {
    return this.PrismaService.session.delete({ where: { id } })
  }
}
