import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
  UseGuards,
  applyDecorators,
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { Request } from 'express'
import { WsException } from '@nestjs/websockets'

@Injectable()
class ProtectorGuard implements CanActivate {
  constructor(private readonly AuthService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest()
    const token = this.extractTokenFromHeader(req)

    if (!token) {
      throw new UnauthorizedException()
    }

    const payload = await this.AuthService.validateAccessToken(token)

    if (payload === 'TOKEN_EXPIRED') {
      throw new ForbiddenException('TOKEN_EXPIRED')
    } else if (!payload) {
      throw new UnauthorizedException()
    }

    req.user = payload

    return true
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }
}

@Injectable()
class AuthGuard implements CanActivate {
  constructor(private readonly AuthService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest()
    const token = this.extractTokenFromHeader(req)

    if (token) {
      const payload = await this.AuthService.validateAccessToken(token)

      if (payload === 'TOKEN_EXPIRED') {
        throw new ForbiddenException('TOKEN_EXPIRED')
      }

      req.user = payload
    } else {
      req.user = null
    }

    return true
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }
}

@Injectable()
class SocketAuthGuard implements CanActivate {
  constructor(private readonly AuthService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const socket = context.switchToWs().getClient()
    const token = this.extractTokenFromHeader(socket)

    if (token) {
      const payload = await this.AuthService.validateAccessToken(token)

      if (payload === 'TOKEN_EXPIRED') {
        throw new WsException('TOKEN_EXPIRED')
      }

      socket.user = payload
    } else {
      socket.user = null
    }

    return true
  }

  private extractTokenFromHeader(socket: any): string | undefined {
    const [type, token] = socket.handshake.headers.authorization?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }
}

@Injectable()
class SocketProtectorGuard implements CanActivate {
  constructor(private readonly AuthService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const socket = context.switchToWs().getClient()
    const token = this.extractTokenFromHeader(socket)

    if (!token) {
      throw new WsException('UNAUTHORIZED')
    }

    const payload = await this.AuthService.validateAccessToken(token)

    if (payload === 'TOKEN_EXPIRED') {
      throw new WsException('TOKEN_EXPIRED')
    } else if (!payload) {
      throw new UnauthorizedException('UNAUTHORIZED')
    }

    socket.user = payload

    return true
  }

  private extractTokenFromHeader(socket: any): string | undefined {
    const [type, token] = socket.handshake.headers.authorization?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }
}

export function ProtectedSocket(data?: any) {
  return applyDecorators(UseGuards(SocketProtectorGuard))
}
export function SocketAuth(data?: any) {
  return applyDecorators(UseGuards(SocketAuthGuard))
}
export function Protected(data?: any) {
  return applyDecorators(UseGuards(ProtectorGuard))
}
export function Auth(data?: any) {
  return applyDecorators(UseGuards(AuthGuard))
}
