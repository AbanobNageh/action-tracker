import { User } from "../../core-data/models/user.model";
import { Action } from "../../core-data/models/action.model";

export abstract class UserDataSource {
  abstract getOne(id: number): User;
  abstract getAll(): User[];
}

export abstract class ActionDataSource {
  abstract isValidActionType(actionType: string): boolean;
  abstract getOne(id: number): Action;
  abstract getActionsByUserId(userId: number): Action[];
  abstract getNextActionsProbabilityByActionType(actionType: string): Map<string, number>;
  abstract getAll(): Action[];
}

export abstract class ReferralRelationshipDataSource {
  abstract buildDataStructure(users: User[], actions: Action[]);
  protected abstract calculateReferralIndexForUser(userId: number);
  protected abstract calculateReferralIndexForAllUsers(users: User[]);
  abstract getReferralIndexByUserId(userId: number): number;
  abstract getReferralIndexForAllUsers(): Map<number, number>;
}