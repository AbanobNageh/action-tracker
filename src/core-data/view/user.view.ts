import { User } from "../models/user.model";

export class UserView {
  id: number;
	name: string;
	createdAt: Date;

  constructor(
    private readonly userData: User | User[],
  ) {}

  render(): UserView | UserView[] {
    if (Array.isArray(this.userData)) {
      return this.renderUserViewList(this.userData);
    } else {
      return this.renderUserView(this.userData);
    }
  }

  private renderUserView(user: User): UserView {
    return {
      id: user.id,
      name: user.name,
      createdAt: user.createdAt,
    } as UserView;
  }

  private renderUserViewList(userList: User[]): UserView[] {
    return userList.map((user) => this.renderUserView(user))
  }
}