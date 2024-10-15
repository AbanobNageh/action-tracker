import { Module } from '@nestjs/common';
import { ActionsService } from './actions.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [],
  providers: [ActionsService],
})
export class ActionsModule {}
