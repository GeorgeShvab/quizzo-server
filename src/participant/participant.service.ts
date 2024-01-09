import { Injectable } from '@nestjs/common'
import { Participant } from '@prisma/client'
import { PrismaService } from 'src/prismaService'

type CreateParticipantParams = Pick<Participant, 'sessionId' | 'avatar' | 'name'>

@Injectable()
export class ParticipantService {
  constructor(private readonly PrismaService: PrismaService) {}

  async create(data: CreateParticipantParams) {
    return this.PrismaService.participant.create({ data })
  }

  async getBySession(id: number) {
    return this.PrismaService.participant.findMany({ where: { sessionId: id } })
  }

  async update(data: Partial<Participant> & { id: number }) {
    return this.PrismaService.participant.update({ where: { id: data.id }, data })
  }
}
