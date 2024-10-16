import { Injectable } from '@nestjs/common';
import { ActionDataSource, ReferralRelationshipDataSource } from '../database/data-sources/data-source';
import { ModuleRef } from '@nestjs/core';
import { ActionLocalDataSource } from '../database/data-sources/action.local.data-source';
import { UserLocalDataSource } from './data-sources/user.local.data-source';
import { GraphReferralRelationshipDataSource } from './data-sources/graph.referral.relationship.data-source';

@Injectable()
export class DatabaseService {
  constructor(
    private moduleRef: ModuleRef,
  ) {}

  loadUserDataSource() {
    switch (process.env.DATA_SOUCE_TYPE) {
      case 'local':
        return this.moduleRef.get(UserLocalDataSource, { strict: false });
      default:
        throw new Error('Invalid user data source type');
    }
  }

  loadActionDataSource(): ActionDataSource {
    switch (process.env.DATA_SOUCE_TYPE) {
      case 'local':
        return this.moduleRef.get(ActionLocalDataSource, { strict: false });
      default:
        throw new Error('Invalid action data source type');
    }
  }

  loadReferralRelationshipDataSource(): ReferralRelationshipDataSource {
    switch (process.env.REFERRAL_DATA_SOURCE_TYPE) {
      case 'graph':
        return this.moduleRef.get(GraphReferralRelationshipDataSource, { strict: false });
      default:
        throw new Error('Invalid action data source type');
    }
  }
}
