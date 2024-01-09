import { Body, Controller, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import { RefreshTokensDTO, SigninDTO } from 'src/dto/auth.dto'
import { User } from 'src/decorators/user.decorator'
import { JwtPayload } from 'src/types'

@Controller()
export class AuthController {
  constructor(private readonly AuthService: AuthService) {}

  @Post('signin')
  async signin(@Body() body: SigninDTO) {
    return this.AuthService.signin(body.email, body.password)
  }

  @Post('auth/refresh')
  async refresh(@Body() body: RefreshTokensDTO) {
    return this.AuthService.refreshTokens(body.token)
  }

  @Post('signout')
  async signout(@User() user: JwtPayload) {}
}
