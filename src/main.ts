import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import cookieParser from 'cookie-parser'
import { ValidationPipe, BadRequestException } from '@nestjs/common'
import { useContainer } from 'class-validator'

const origins = process.env.ORIGINS?.split(',')

if (!origins) throw new Error('No enabled origins')

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.setGlobalPrefix('api')
  app.use(cookieParser())
  app.enableCors({
    origin: origins,
    credentials: true,
  })
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      exceptionFactory(errors) {
        const result = {}

        for (let error of errors) {
          result[error.property] = error.constraints[Object.keys(error.constraints)[0]]
        }

        throw new BadRequestException(result)
      },
    })
  )
  useContainer(app.select(AppModule), { fallbackOnErrors: true })
  await app.listen(process.env.PORT)
}
bootstrap()
