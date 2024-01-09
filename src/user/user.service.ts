import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prismaService'
import bcrypt from 'bcrypt'
import { User } from '@prisma/client'

type CreateUserParams = Pick<User, 'password' | 'email' | 'name'>

@Injectable()
export class UserService {
  constructor(private readonly PrismaService: PrismaService) {}

  async getById(id: number) {
    return this.PrismaService.user.findUnique({ where: { id } })
  }

  async getByEmail(email: string) {
    return this.PrismaService.user.findFirst({ where: { email } })
  }

  async register(data: CreateUserParams) {
    const password = await this.hashPassword(data.password)
    return this.create({ ...data, password })
  }

  async update(data: Partial<User> & { id: number }) {
    return await this.PrismaService.user.update({ where: { id: data.id }, data })
  }

  async create(data: CreateUserParams) {
    return this.PrismaService.user.create({ data })
  }

  async hashPassword(password: string) {
    const salt = await bcrypt.genSalt()
    return await bcrypt.hash(password, salt)
  }

  async comparePasswords(password: string, hashedPassword: string) {
    return bcrypt.compare(password, hashedPassword)
  }
}
