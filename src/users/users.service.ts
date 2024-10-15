import { Injectable } from '@nestjs/common';
import { UserDataSource } from '../database/data-sources/data-source';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class UsersService {
  private userDataSource: UserDataSource;

  constructor(
    private databaseService: DatabaseService,
  ) {
    this.userDataSource = this.databaseService.loadUserDataSource();
  }

  getUserById(userId: number) {
    return this.userDataSource.getOne(userId);
  }
}
