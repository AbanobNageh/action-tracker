import { Injectable } from '@nestjs/common';
import { UserDataSource } from '../database/data-sources/data-source';
import { DatabaseService } from '../database/database.service';
import { ActionDataSource } from '../database/data-sources/data-source';

@Injectable()
export class UsersService {
  private userDataSource: UserDataSource;
  private actionDataSource: ActionDataSource;

  constructor(
    private databaseService: DatabaseService,
  ) {
    this.userDataSource = this.databaseService.loadUserDataSource();
    this.actionDataSource = this.databaseService.loadActionDataSource();
  }

  getUserById(userId: number) {
    return this.userDataSource.getOne(userId);
  }

  getActionCountByUserId(userId: number) {
    return this.actionDataSource.getActionsByUserId(userId).length;
  }
}
