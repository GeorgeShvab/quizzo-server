import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService, TokenExpiredError } from '@nestjs/jwt'
import { PrismaService } from 'src/prismaService'
import { JwtPayload } from 'src/types'
import { UserService } from 'src/user/user.service'

@Injectable()
export class AuthService {
  constructor(
    private readonly UserService: UserService,
    private readonly JwtService: JwtService,
    private readonly PrismaService: PrismaService
  ) {}

  async signin(email: string, password: string) {
    const user = await this.validate(email, password)
    if (user) {
      return this.generateTokens({ id: user.id, name: user.name, email: user.email })
    }
  }

  async signout(token: string) {
    const data = await this.PrismaService.refreshToken.findFirst({ where: { token } })

    await this.PrismaService.refreshToken.delete({ where: { id: data.id } })
  }

  async validate(email: string, password: string) {
    const user = await this.UserService.getByEmail(email)

    if (!user || !(await this.UserService.comparePasswords(password, user.password))) {
      throw new UnauthorizedException()
    }

    return user
  }

  async refreshTokens(token: string) {
    const payload = await this.validateRefreshToken(token)

    const dbToken = await this.PrismaService.refreshToken.findFirst({ where: { token } })

    await this.PrismaService.refreshToken.delete({ where: { id: dbToken.id } })

    if (!payload || payload === 'TOKEN_EXPIRED' || !dbToken) {
      throw new UnauthorizedException()
    }

    return this.generateTokens(payload)
  }

  async generateTokens(payload: JwtPayload) {
    const accessToken = await this.generateAccessToken(payload)

    const refreshToken = await this.generateRefreshToken(payload)

    return { accessToken, refreshToken }
  }

  private async generateAccessToken(payload: JwtPayload) {
    const accessToken = await this.JwtService.signAsync(payload, {
      secret: process.env.JWT_ACCESS_KEY,
      expiresIn: '30m',
    })

    return accessToken
  }

  private async generateRefreshToken(payload: JwtPayload) {
    const refreshToken = await this.JwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_KEY,
      expiresIn: '30d',
    })

    await this.PrismaService.refreshToken.create({ data: { token: refreshToken, userId: payload.id } })

    return refreshToken
  }

  async validateRefreshToken(token: string) {
    try {
      const data = await this.JwtService.verifyAsync(token, { secret: process.env.JWT_REFRESH_KEY })

      return data as JwtPayload
    } catch (e) {
      if (e instanceof TokenExpiredError) return 'TOKEN_EXPIRED'

      return null
    }
  }

  async validateAccessToken(token: string) {
    try {
      const data = await this.JwtService.verifyAsync(token, { secret: process.env.JWT_ACCESS_KEY })

      return data as JwtPayload
    } catch (e) {
      if (e instanceof TokenExpiredError) return 'TOKEN_EXPIRED'

      return null
    }
  }
}
