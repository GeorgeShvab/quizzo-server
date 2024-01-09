import { IsEmail, IsNotEmpty, IsOptional, IsString, Max, MaxLength, Min, MinLength } from 'class-validator'
import { IsEmailTaken } from 'src/decorators/user.decorator'
import messages from 'src/messages'

export class SignupDTO {
  @IsNotEmpty({ message: messages.USER_NAME_IS_REQUIRED })
  @IsString({ message: messages.USER_NAME_IS_REQUIRED })
  @MinLength(3, { message: messages.USER_INVALID_NAME_MIN_LENGTH })
  @MaxLength(30, { message: messages.USER_INVALID_NAME_MAX_LENGTH })
  name: string

  @IsNotEmpty({ message: messages.USER_EMAIL_IS_REQUIRED })
  @IsString({ message: messages.USER_EMAIL_IS_REQUIRED })
  @IsEmail({}, { message: messages.USER_INVALID_EMAIL })
  @IsEmailTaken({ message: messages.USER_EMAIL_IS_TAKEN })
  email: string

  @IsNotEmpty({ message: messages.USER_PASSWORD_IS_REQUIRED })
  @IsString({ message: messages.USER_PASSWORD_IS_REQUIRED })
  @MinLength(6, { message: messages.USER_INVALID_PASSWORD_MIN_LENGTH })
  @MaxLength(100, { message: messages.USER_INVALID_PASSWORD_MAX_LENGTH })
  password: string
}

export class UpdateUserDTO {
  @IsOptional()
  @IsString({ message: messages.USER_NAME_IS_REQUIRED })
  @MinLength(3, { message: messages.USER_INVALID_NAME_MIN_LENGTH })
  @MaxLength(30, { message: messages.USER_INVALID_NAME_MAX_LENGTH })
  name: string
}
