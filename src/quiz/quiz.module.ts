import { Module } from '@nestjs/common'
import { QuizController } from './quiz.controller'
import { QuizService } from './quiz.service'
import { PrismaService } from 'src/prismaService'
import { AuthService } from 'src/auth/auth.service'
import { JwtService } from '@nestjs/jwt'
import { UserService } from 'src/user/user.service'

@Module({
  imports: [],
  controllers: [QuizController],
  providers: [PrismaService, QuizService, AuthService, JwtService, UserService],
})
export class QuizModule {}
