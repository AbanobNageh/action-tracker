import { Action } from "../models/action.model";

export class ActionView {
  id: number;
	type: string;
	userId: number;
	targetUser: number;   
	createdAt: Date;

  constructor(
    private readonly actionData: Action | Action[],
  ) {}

  render(): ActionView | ActionView[] {
    if (Array.isArray(this.actionData)) {
      return this.renderUserViewList(this.actionData);
    } else {
      return this.renderUserView(this.actionData);
    }
  }

  private renderUserView(action: Action): ActionView {
    return {
      id: action.id,
      type: action.type,
      userId: action.userId,
      targetUser: action.targetUser,   
      createdAt: action.createdAt,
    } as ActionView;
  }

  private renderUserViewList(actionList: Action[]): ActionView[] {
    return actionList.map((user) => this.renderUserView(user))
  }
}