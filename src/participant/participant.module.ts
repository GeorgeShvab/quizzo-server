import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prismaService'
import { ParticipantService } from './participant.service'

@Module({ imports: [], controllers: [], providers: [PrismaService, ParticipantService] })
export class ParticipantModule {}
