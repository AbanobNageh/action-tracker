import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  isEmpty,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  isArray,
  isString,
} from 'class-validator';
import { ActionDataSource } from '../../database/data-sources/data-source';
import { DatabaseService } from '../../database/database.service';

export function IsValidActionType(variableToLoadModelInto?: string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsValidActionType',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [variableToLoadModelInto],
      options: validationOptions,
      validator: IsValidActionTypeRule,
    });
  };
}

@ValidatorConstraint({ name: 'IsValidActionType', async: true })
@Injectable()
export class IsValidActionTypeRule implements ValidatorConstraintInterface {
  private actionDataSource: ActionDataSource;

  constructor(
    private readonly databaseService: DatabaseService
  ) {
    this.actionDataSource = this.databaseService.loadActionDataSource();
  }

  async validate(value: string, args: ValidationArguments) {
    if (isEmpty(value)) {
      return false;
    }

    if (!isString(value)) {
      return false;
    }

    if (!this.actionDataSource.isValidActionType(value)) {
      return false;
    }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    if (isArray(args.object[args.property])) {
      return `${args.property} must be an string array, each a valid action type.`;
    } else {
      return `${args.property} must be a valid action type.`;
    }
  }
}
