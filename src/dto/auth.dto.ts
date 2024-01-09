import { IsEmail, IsNotEmpty, IsString, Max, MaxLength, Min, MinLength } from 'class-validator'
import messages from 'src/messages'

export class SigninDTO {
  @IsNotEmpty({ message: messages.USER_INCORRECT_CREDENTIALS })
  @IsEmail({}, { message: messages.USER_INCORRECT_CREDENTIALS })
  email: string

  @IsNotEmpty({ message: messages.USER_INCORRECT_CREDENTIALS })
  @IsString({ message: messages.USER_INCORRECT_CREDENTIALS })
  @MinLength(6, { message: messages.USER_INCORRECT_CREDENTIALS })
  @MaxLength(100, { message: messages.USER_INCORRECT_CREDENTIALS })
  password: string
}

export class RefreshTokensDTO {
  @IsNotEmpty({ message: messages.TOKEN_IS_REQUIRED })
  @IsString({ message: messages.TOKEN_IS_REQUIRED })
  token: string
}

export class SignoutDTO {
  @IsNotEmpty({ message: messages.TOKEN_IS_REQUIRED })
  @IsString({ message: messages.TOKEN_IS_REQUIRED })
  token: string
}
