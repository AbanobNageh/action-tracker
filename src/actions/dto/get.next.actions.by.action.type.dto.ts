import { Type } from 'class-transformer';
import { IsValidActionType } from '../../core-utils/validator/action.type.validator';

export class GetNextActionsByActionTypeDto {
  @Type(() => String)
  @IsValidActionType()
  actionType: string;
}