import { User } from "../../core-data/models/user.model";
import { Action } from "../../core-data/models/action.model";

export abstract class UserDataSource {
  abstract getOne(id: number): User;
  abstract getAll(): User[];
}

export abstract class ActionDataSource {
  abstract getOne(id: number): Action;
  abstract getAll(): Action[];
}