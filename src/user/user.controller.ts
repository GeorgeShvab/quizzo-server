import { Body, Controller, Get, Post } from '@nestjs/common'
import { AuthService } from 'src/auth/auth.service'
import { SignupDTO, UpdateUserDTO } from 'src/dto/user.dto'
import { UserService } from './user.service'
import { Protected } from 'src/auth/auth.guard'
import { User } from 'src/decorators/user.decorator'
import { JwtPayload } from 'src/types'

@Controller()
export class UserController {
  constructor(private readonly AuthService: AuthService, private readonly UserService: UserService) {}

  @Get('user/me')
  @Protected()
  async getMe(@User() user: JwtPayload) {
    return await this.UserService.getById(user.id)
  }

  @Post('signup')
  async signin(@Body() body: SignupDTO) {
    const user = await this.UserService.register(body)

    return this.AuthService.generateTokens(user)
  }

  @Post('user/update')
  async update(@Body() body: UpdateUserDTO, @User() user: JwtPayload) {
    return this.UserService.update({ ...body, id: user.id })
  }
}
