import { Type } from 'class-transformer';
import { IsValidActionType } from 'src/core-utils/validator/action.type.validator';


export class GetNextActionsByActionTypeDto {
  @Type(() => String)
  @IsValidActionType()
  actionType: string;
}