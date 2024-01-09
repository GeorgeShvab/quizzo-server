import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prismaService'
import { UserService } from 'src/user/user.service'
import { AuthService } from './auth.service'
import { JwtService } from '@nestjs/jwt'
import { AuthController } from './auth.controller'

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [PrismaService, UserService, AuthService, JwtService],
})
export class AuthModule {}
