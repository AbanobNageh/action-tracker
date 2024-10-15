export class Action {
  id: number;
	type: string;
	userId: number;
	targetUser: number;   
	createdAt: Date;

  constructor(
    id: number,
    type: string,
    userId: number,
    targetUser: number,   
    createdAt: Date,
  ) {
    this.id = id;
    this.type = type;
    this.userId = userId;
    this.targetUser = targetUser;
    this.createdAt = createdAt;
  }
}