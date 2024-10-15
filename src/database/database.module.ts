import { Module } from '@nestjs/common';
import { UserLocalDataSource } from './data-sources/user.local.data-source';
import { ActionLocalDataSource } from './data-sources/action.local.data-source';
import { DatabaseService } from './database.service';

@Module({
  imports: [],
  controllers: [],
  providers: [DatabaseService, UserLocalDataSource, ActionLocalDataSource],
  exports: [DatabaseService],
})
export class DatabaseModule {}
