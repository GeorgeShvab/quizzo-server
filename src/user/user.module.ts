import { Module } from '@nestjs/common'
import { UserController } from './user.controller'
import { PrismaService } from 'src/prismaService'
import { UserService } from './user.service'
import { AuthService } from 'src/auth/auth.service'
import { JwtService } from '@nestjs/jwt'
import { IsEmailTakenValidation } from 'src/decorators/user.decorator'

@Module({
  imports: [],
  controllers: [UserController],
  providers: [PrismaService, UserService, AuthService, JwtService, IsEmailTakenValidation],
})
export class UserModule {}
