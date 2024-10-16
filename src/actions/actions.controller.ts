import { Controller, Get, Param, ValidationPipe } from '@nestjs/common';
import { GetNextActionsByActionTypeDto } from './dto/get.next.actions.by.action.type.dto';
import { ActionsService } from './actions.service';

@Controller('actions')
export class ActionsController {
  constructor(private readonly actionsService: ActionsService) {}

  @Get('/:actionType/next-actions')
  GetNextActionsByActionType(@Param(new ValidationPipe({ transform: true })) queryParams: GetNextActionsByActionTypeDto) {
    return Object.fromEntries(this.actionsService.getNextActionsProbabilityByActionType(queryParams.actionType));
  }
}
