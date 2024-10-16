import { Module } from '@nestjs/common';
import { ActionsService } from './actions.service';
import { DatabaseModule } from '../database/database.module';
import { ActionsController } from './actions.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [ActionsController],
  providers: [ActionsService],
})
export class ActionsModule {}
