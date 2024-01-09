import {
  Catch,
  BadRequestException,
  ArgumentsHost,
  ExceptionFilter,
  HttpException,
  UseFilters,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common'
import {
  BaseWsExceptionFilter,
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { ProtectedSocket, SocketAuth } from 'src/auth/auth.guard'
import { JwtPayload } from 'src/types'
import wait from '../utils/wait'

declare module 'socket.io' {
  interface Socket {
    user?: JwtPayload
  }
}

import { GatewayAnswerDTO, GatewayJoinDTO, GatewayOpenDTO, GatewayPrejoinDTO } from 'src/dto/gateway.dto'
import { SessionService } from './session.service'
import { QuizService } from 'src/quiz/quiz.service'
import { ParticipantService } from 'src/participant/participant.service'
import { AnswerService } from 'src/answer/answer.service'
import events from './events.map'
import { Question } from '@prisma/client'
import stages from './stages.map'
import { User } from 'src/decorators/user.decorator'
import { SessionQuestionService } from 'src/session-question/session-question.service'
import { QuestionService } from 'src/question/question.service'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    throw new WsException(exception.message)
  }
}

@UseFilters(new HttpExceptionFilter())
@WebSocketGateway(8000, {
  namespace: 'session',
  cors: ['http://localhost:3000', 'http://192.168.0.61:3000'],
  middlewares: [],
})
export class SessionSocket {
  @WebSocketServer() server: Server

  constructor(
    private readonly SessionService: SessionService,
    private readonly QuizService: QuizService,
    private readonly ParticipantService: ParticipantService,
    private readonly AnswerService: AnswerService,
    private readonly SessionQuestionService: SessionQuestionService
  ) {}

  @SocketAuth()
  handleConnection(@ConnectedSocket() client: Socket, @User() user: JwtPayload) {
    console.log('new connection!', client.id)
  }

  async handleDisconnect(@ConnectedSocket() client: Socket) {
    const room = String(client.data.sessionId)

    const participants = await this.getParticipants(room)

    this.server.to(room).emit(events.RECEIVE_PARTICIPANTS, participants)
  }

  @SubscribeMessage(events.GET_SESSION_STATUS)
  @SocketAuth()
  async prejoin(@ConnectedSocket() client: Socket, @MessageBody() body: GatewayPrejoinDTO) {
    const session = await this.SessionService.get(body.sessionId)

    if (!session) {
      client.emit(events.RECEIVE_SESSION_STATUS, stages.SESSION_NOT_FOUND)
    } else {
      client.data.sessionId = body.sessionId

      await client.join(String(body.sessionId))

      client.emit(events.RECEIVE_SESSION_STATUS, session.status)
      client.emit(events.RECEIVE_QUIZ, session.quiz)

      if (session.status === 'opened') {
        client.emit(events.RECEIVE_STAGE, stages.PARTICIPANT_FORM)
      } else if (session.status === 'closed') {
        client.emit(events.RECEIVE_STAGE, stages.SESSION_IS_CLOSED)
      } else if (session.status === 'ended') {
        client.emit(events.RECEIVE_STAGE, stages.SESSION_IS_ENDED)
      } else if (session.status === 'started') {
        client.emit(events.RECEIVE_STAGE, stages.SESSION_HAS_STARTED)
      } else if (session.status === 'created') {
        client.emit(events.RECEIVE_STAGE, stages.SESSION_IS_CLOSED)
      }
    }
  }

  @SubscribeMessage(events.JOIN)
  @SocketAuth()
  async join(@ConnectedSocket() client: Socket, @MessageBody() body: GatewayJoinDTO) {
    const room = client.data.sessionId

    client.data.name = body.name
    client.data.avatar = body.avatar

    const session = await this.SessionService.get(room)

    if (session.status !== 'opened') throw new WsException('FORBIDDEN')

    await client.join(room)

    const participants = await this.getParticipants(room)

    const participant = await this.ParticipantService.create({ ...body, sessionId: room })

    client.data.participantId = participant.id
    client.data.isJonined = true

    this.server.to(room).emit(events.RECEIVE_PARTICIPANTS, participants)

    client.emit(events.RECEIVE_CLIENT_STATUS, 'joined')
    client.emit(events.RECEIVE_STAGE, stages.PARTICIPANT_LIST)
  }

  @SubscribeMessage(events.JOIN_AS_OWNER)
  @ProtectedSocket()
  async joinAsOwner(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: GatewayPrejoinDTO,
    @User() user: JwtPayload
  ) {
    const session = await this.SessionService.get(body.sessionId)

    if (session.ownerId === user.id) {
      console.log('owner has joined')
      client.data.isOwner = true
    }
  }

  @SubscribeMessage(events.OPEN_JOINING)
  @ProtectedSocket()
  async handleOpen(@ConnectedSocket() client: Socket, @MessageBody() body: GatewayOpenDTO) {
    if (client.data.isOwner) {
      await this.SessionService.update({ id: body.sessionId, status: 'opened' })

      this.server.to(String(body.sessionId)).emit(events.RECEIVE_SESSION_STATUS, 'opened')
      this.server.to(String(body.sessionId)).emit(events.RECEIVE_STAGE, stages.PARTICIPANT_FORM)
    } else {
      throw new WsException('UNAUTHORIZED')
    }
  }

  @SubscribeMessage(events.SEND_ANSWER)
  async answer(@ConnectedSocket() client: Socket, @MessageBody() body: GatewayAnswerDTO) {
    await this.AnswerService.create({
      ...body,
      sessionId: client.data.sessionId,
      participantId: client.data.participantId,
    })
  }

  @SubscribeMessage(events.CLOSE_JOINING)
  @ProtectedSocket()
  async handleClose(@ConnectedSocket() client: Socket, @MessageBody() body: GatewayOpenDTO) {
    if (client.data.isOwner) {
      await this.SessionService.update({ id: body.sessionId, status: 'closed' })

      const sessionId = String(body.sessionId)

      this.server.to(sessionId).emit(events.RECEIVE_SESSION_STATUS, 'closed')
      this.server.to(sessionId).emit(events.RECEIVE_STAGE, stages.WAITING_FOR_START)

      const participants = await this.getParticipants(sessionId)

      this.server.to(sessionId).emit(events.RECEIVE_PARTICIPANTS, participants)
    } else {
      throw new WsException('UNAUTHORIZED')
    }
  }

  @SubscribeMessage(events.START)
  @ProtectedSocket()
  async handleStart(@ConnectedSocket() client: Socket, @MessageBody() body: GatewayOpenDTO) {
    if (client.data.isOwner) {
      const quiz = await this.QuizService.get(body.sessionId)

      const sessionId = String(body.sessionId)

      await this.SessionService.update({ id: body.sessionId, status: 'started' })

      this.server.to(sessionId).emit(events.RECEIVE_SESSION_STATUS, 'started')

      this.server.to(sessionId).emit(events.RECEIVE_STAGE, stages.QUIZ_COUNTDOWN)
      await wait(1000 * 10)

      await this.sendQuestions(quiz.questions, sessionId)

      this.server.to(sessionId).emit(events.RECEIVE_STAGE, stages.RESULTS_COUNTDOWN)
      await wait(1000 * 10)

      const results = await this.calculateResults(body.sessionId, quiz.id)

      this.server.to(sessionId).emit(events.RECEIVE_STAGE, stages.RESULTS)
      this.server.to(sessionId).emit(events.RECEIVE_PARTICIPANTS, results)

      await this.SessionService.update({ id: body.sessionId, status: 'ended' })
    } else {
      throw new WsException('UNAUTHORIZED')
    }
  }

  private async sendQuestions(questions: Question[], sessionId: string) {
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i]
      if (i) {
        this.server.to(sessionId).emit(events.RECEIVE_STAGE, stages.QUESTION_COUNTDOWN)
        await wait(1000 * 10)
      }

      await this.SessionQuestionService.create({ questionId: question.id, sessionId: Number(sessionId) })
      this.server.to(sessionId).emit(events.RECEIVE_QUESTION, { ...question, startedAt: Date.now() })
      this.server.to(sessionId).emit(events.RECEIVE_STAGE, stages.QUESTION)

      await wait(1000 * 60)
    }
  }

  private async getParticipants(room: string) {
    const participants = (await this.server.in(String(room)).fetchSockets())
      .map((item) => item.data)
      .filter((item) => item.name && item.avatar)

    return participants
  }

  private async calculateResults(sessionId: number, quizId: number) {
    const answersPromise = this.AnswerService.getBySession(sessionId)
    const questionsPromise = this.SessionQuestionService.getBySession(sessionId)

    const [answers, questions] = await Promise.all([answersPromise, questionsPromise])

    const results = {}

    for (let answer of answers) {
      let points = 0

      if (answer.answer === answer.question.answer) {
        const question = questions.find((item) => item.id === answer.questionId)

        points = 1

        points += (new Date(answer.createdAt).getDate() - new Date(question.createdAt).getDate()) / 100000
      }

      if (!results[answer.participantId]) {
        results[answer.participantId] = points
      } else {
        results[answer.participantId] += points
      }
    }

    for (let id in results) {
      await this.ParticipantService.update({ id: Number(id), points: results[id].points })
    }

    return this.ParticipantService.getBySession(sessionId)
  }
}
