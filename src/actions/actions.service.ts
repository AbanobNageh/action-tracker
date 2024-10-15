import { Injectable } from '@nestjs/common';
import { ActionDataSource } from '../database/data-sources/data-source';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class ActionsService {
  private actionDataSource: ActionDataSource;

  constructor(
    private databaseService: DatabaseService,
  ) {
    this.actionDataSource = this.databaseService.loadActionDataSource();
  }
}
