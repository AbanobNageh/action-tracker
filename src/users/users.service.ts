import { Injectable } from '@nestjs/common';
import { ReferralRelationshipDataSource, UserDataSource } from '../database/data-sources/data-source';
import { DatabaseService } from '../database/database.service';
import { ActionDataSource } from '../database/data-sources/data-source';

@Injectable()
export class UsersService {
  private userDataSource: UserDataSource;
  private actionDataSource: ActionDataSource;
  private referralRelationshipDataSource: ReferralRelationshipDataSource;

  constructor(
    private databaseService: DatabaseService,
  ) {
    this.userDataSource = this.databaseService.loadUserDataSource();
    this.actionDataSource = this.databaseService.loadActionDataSource();
    this.referralRelationshipDataSource = this.databaseService.loadReferralRelationshipDataSource();
    this.referralRelationshipDataSource.buildDataStructure(this.userDataSource.getAll(), this.actionDataSource.getAll());
  }

  getUserById(userId: number) {
    return this.userDataSource.getOne(userId);
  }

  getActionCountByUserId(userId: number) {
    return this.actionDataSource.getActionsByUserId(userId).length;
  }

  getUsersReferralIndex() {
    return this.referralRelationshipDataSource.getReferralIndexForAllUsers();
  }
}
