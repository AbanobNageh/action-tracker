import * as path from 'path';
import { ActionDataSource } from "./data-source";
import { FileSystemUtils } from '../../core-utils/file-system.utils';
import { Action } from '../../core-data/models/action.model';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ActionLocalDataSource extends ActionDataSource {
  private USER_DATABASE_FILE_PATH = path.join(__dirname, '../../../data/actions.json');
  private actions: Action[] = [];

  constructor() {
    super();
    this.loadActionDatabaseFromFile();
  }

  loadActionDatabaseFromFile() {
    if (!FileSystemUtils.doesPathExists(this.USER_DATABASE_FILE_PATH)) {
      throw new Error('Action database file does not exist');
    }

    const actions = JSON.parse(FileSystemUtils.readFile(this.USER_DATABASE_FILE_PATH).toString());
    for (const action of actions) {
      this.actions.push(
        new Action(
          action.id,
          action.type,
          action.userId,
          action.targetUser,   
          new Date(action.createdAt),
        )
      );
    }
    console.log('Action database loaded');
  }
  
  getOne(id: number): Action {
    return this.actions.find(user => user.id === id);
  }

  getActionsByUserId(userId: number): Action[] {
    return this.actions.filter(action => action.userId === userId);
  }

  getAll(): Action[] {
    return this.actions;
  }
}