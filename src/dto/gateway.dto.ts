import { IsNotEmpty, IsNumber, IsString, MaxLength, MinLength } from 'class-validator'

export class GatewayJoinDTO {
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(20)
  avatar: string

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  name: string
}

export class GatewayPrejoinDTO {
  @IsNotEmpty()
  @IsNumber()
  sessionId: number
}

export class GatewayOpenDTO {
  @IsNotEmpty()
  @IsNumber()
  sessionId: number
}

export class GatewayAnswerDTO {
  @IsNotEmpty()
  @IsNumber()
  questionId: number

  @IsNotEmpty()
  @IsNumber()
  answer: number
}
