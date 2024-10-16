import { Module } from '@nestjs/common';
import { IsValidActionTypeRule } from './validator/action.type.validator';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [],
  providers: [IsValidActionTypeRule],
})
export class CoreUtilsModule {}
