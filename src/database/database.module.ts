import { Module } from '@nestjs/common';
import { UserLocalDataSource } from './data-sources/user.local.data-source';
import { ActionLocalDataSource } from './data-sources/action.local.data-source';
import { DatabaseService } from './database.service';
import { GraphReferralRelationshipDataSource } from './data-sources/graph.referral.relationship.data-source';

@Module({
  imports: [],
  controllers: [],
  providers: [DatabaseService, UserLocalDataSource, ActionLocalDataSource, GraphReferralRelationshipDataSource],
  exports: [DatabaseService],
})
export class DatabaseModule {}
