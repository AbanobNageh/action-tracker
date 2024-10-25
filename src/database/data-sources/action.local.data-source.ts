import * as path from 'path';
import { ActionDataSource } from "./data-source";
import { FileSystemUtils } from '../../core-utils/file-system.utils';
import { Action } from '../../core-data/models/action.model';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ActionLocalDataSource extends ActionDataSource {
  private ACTION_DATABASE_FILE_PATH = path.join(__dirname, '../../../data/actions.json');
  private actions: Action[] = [];
  private actionTypeCache: Set<string> = new Set();
  private nextActionsProbabilityMap: Map<string, Map<string, number>> = new Map();

  constructor() {
    super();
    this.loadActionDatabaseFromFile();
  }

  loadActionDatabaseFromFile() {
    if (!FileSystemUtils.doesPathExist(this.ACTION_DATABASE_FILE_PATH)) {
      throw new Error('Action database file does not exist');
    }

    this.actions = [];
    this.actionTypeCache = new Set();
    this.nextActionsProbabilityMap = new Map();
    const actions = JSON.parse(FileSystemUtils.readFile(this.ACTION_DATABASE_FILE_PATH).toString());
    for (const action of actions) {
      if (!this.actionTypeCache.has(action.type)) {
        this.actionTypeCache.add(action.type);
      }

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

    this.actions.sort((firstAction, secondAction) => firstAction.createdAt.getTime() - secondAction.createdAt.getTime());

    console.log(`Action database loaded, ${this.actions.length} actions loaded.`);
  }
  
  isValidActionType(actionType: string): boolean {
    return this.actionTypeCache.has(actionType);
  }

  getOne(id: number): Action {
    return this.actions.find(action => action.id === id);
  }

  getActionsByUserId(userId: number): Action[] {
    return this.actions.filter(action => action.userId === userId);
  }

  getNextActionsProbabilityByActionType(actionType: string): Map<string, number> {
    if (this.nextActionsProbabilityMap.has(actionType)) {
      return this.nextActionsProbabilityMap.get(actionType);
    }

    const nextActionsCount: Map<string, number> = new Map();
    let totalActionCount = 0;

    for (let actionIndex = 0; actionIndex < this.actions.length - 1; actionIndex++) {
      const action = this.actions[actionIndex];
      const nextAction = this.actions[actionIndex + 1];

      if (action.type !== actionType) {
        continue;
      }

      totalActionCount++;
      if (!nextActionsCount.has(nextAction.type)) {
        nextActionsCount.set(nextAction.type, 1);
      } else {
        nextActionsCount.set(nextAction.type, nextActionsCount.get(nextAction.type) + 1);
      }
    }

    const nextActionsProbability: Map<string, number> = new Map();
    nextActionsCount.forEach((value, key) => {
      const probability = value / totalActionCount;
      nextActionsProbability.set(key, probability);
    });

    this.nextActionsProbabilityMap.set(actionType, nextActionsProbability);

    return nextActionsProbability;
  }

  getAll(): Action[] {
    return this.actions;
  }
}