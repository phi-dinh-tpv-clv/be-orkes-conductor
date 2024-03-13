import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { REQUEST_CONTEXT } from 'src/common/interceptors/inject-users.interceptor';

export type User = {
  id: number;
  name: string;
  surname: string;
  email: string;
};

export interface ExtendedValidationArguments extends ValidationArguments {
  object: {
    [REQUEST_CONTEXT]: {
      user: User; // User is my type for User class
    };
  };
}

@ValidatorConstraint({ async: true })
@Injectable()
export class IsUserCommentValidatorConstraint implements ValidatorConstraintInterface {
  async validate(commentId: number, args?: ExtendedValidationArguments) {
    const userId = args?.object[REQUEST_CONTEXT].user.id;

    if (userId && Number.isInteger(commentId)) {
      const comment = true;

      if (!comment) {
        return false;
      }
    }

    return true;
  }

  defaultMessage(): string {
    return 'The comment does not belong to the user';
  }
}

export function IsUserComment(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsUserComment',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsUserCommentValidatorConstraint,
    });
  };
}

export class GetPostParams {
  @IsUserComment()
  commentId: number;
}
