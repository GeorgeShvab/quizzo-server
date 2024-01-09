import { BadRequestException, Body, Controller, Get, Param, Post } from '@nestjs/common'
import { QuizService } from './quiz.service'
import { CreateQuizDTO } from 'src/dto/quiz.dto'
import { Protected } from 'src/auth/auth.guard'
import { User } from 'src/decorators/user.decorator'
import { JwtPayload } from 'src/types'

@Controller('quiz')
export class QuizController {
  constructor(private readonly QuizService: QuizService) {}

  @Post()
  @Protected()
  async create(@Body() body: CreateQuizDTO, @User() user: JwtPayload) {
    return this.QuizService.create({ ...body, ownerId: user.id })
  }

  @Get('/:id')
  async get(@Param('id') id: string) {
    if (Number.isNaN(Number(id))) throw new BadRequestException()

    return this.QuizService.get(Number(id))
  }
}
