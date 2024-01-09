import { ExecutionContext, Injectable, createParamDecorator } from '@nestjs/common'
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator'
import { UserService } from 'src/user/user.service'

@ValidatorConstraint({ name: 'IsEmailTaken', async: true })
@Injectable()
export class IsEmailTakenValidation implements ValidatorConstraintInterface {
  constructor(private readonly UserService: UserService) {}

  async validate(value: string, args: ValidationArguments) {
    const user = await this.UserService.getByEmail(value)

    if (user) {
      return false
    } else {
      return true
    }
  }

  defaultMessage(args: ValidationArguments) {
    return 'User with this email is already exists'
  }
}

export function IsEmailTaken(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string): void {
    registerDecorator({
      name: 'IsEmailTaken',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsEmailTakenValidation,
    })
  }
}

export const User = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest()
  return request.user
})
