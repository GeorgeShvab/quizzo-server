import { IsArray, IsNotEmpty, IsNumber, IsString, MaxLength, MinLength } from 'class-validator'

export class CreateQuizDTO {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  title: string

  @IsNotEmpty()
  @IsArray()
  questions: CreateQuestionParams[]
}

interface CreateQuestionParams {
  title: string
  variants: string[]
  answer: number
  quizId: number
  position: number
}
