import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common'
import { SessionService } from './session.service'
import { Protected } from 'src/auth/auth.guard'
import { User } from 'src/decorators/user.decorator'
import { JwtPayload } from 'src/types'
import { CreateSessionDTO, UpdateSessionDTO } from 'src/dto/session.dto'

@Controller('session')
export class SessionController {
  constructor(private readonly SessionService: SessionService) {}

  @Post()
  @Protected()
  async create(@Body() body: CreateSessionDTO, @User() user: JwtPayload) {
    return this.SessionService.create({ ownerId: user.id, quizId: body.quizId })
  }

  @Get(':id')
  async get(id: string) {
    return this.SessionService.get(Number(id))
  }

  @Patch(':id/update')
  async update(@Param('id') id: string, @Body() body: UpdateSessionDTO) {
    return this.SessionService.update({ id: Number(id), ...body })
  }
}
