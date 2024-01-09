import { IsBoolean, IsNotEmpty, IsNumber } from 'class-validator'

export class CreateSessionDTO {
  @IsNotEmpty()
  @IsNumber()
  quizId: number
}

export class UpdateSessionDTO {
  @IsNotEmpty()
  @IsBoolean()
  isOpen: boolean
}
