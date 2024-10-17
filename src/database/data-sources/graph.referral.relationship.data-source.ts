import { User } from '../../core-data/models/user.model';
import { ReferralRelationshipDataSource } from './data-source';
import { Injectable } from '@nestjs/common';
import { Action } from 'src/core-data/models/action.model';

@Injectable()
export class GraphReferralRelationshipDataSource extends ReferralRelationshipDataSource {
  private adjacencyList: Map<number, number[]> = new Map();
  private referralIndices: Map<number, number> = new Map();

  buildDataStructure(users: User[], actions: Action[]) {
    this.adjacencyList.clear();
    this.referralIndices.clear();
    users.forEach((user) => this.adjacencyList.set(user.id, []));

    actions.forEach((action) => {
      if (action.type !== 'REFER_USER' || action.targetUser === undefined) {
        return;
      }

      const referringUser = action.userId;
      const referredUser = action.targetUser;

      const referrals = this.adjacencyList.get(referringUser);
      if (referrals) {
        referrals.push(referredUser);
      } else {
        this.adjacencyList.set(referringUser, [referredUser]);
      }
    });

    this.calculateReferralIndexForAllUsers(users);
    console.log(`Built Referral graph and calculate referral indices, ${this.referralIndices.size} referral indices calculated.`);
  }

  protected calculateReferralIndexForUser(userId: number) {
    const referralIndex = this.iterativeDFS(userId);
    this.referralIndices.set(userId, referralIndex);
  }

  protected async calculateReferralIndexForAllUsers(users: User[]) {
    await Promise.all(
      users.map(async (user) => {
        this.calculateReferralIndexForUser(user.id);
      }),
    );
  }

  getReferralIndexByUserId(userId: number): number {
    return this.referralIndices.get(userId);
  }

  getReferralIndexForAllUsers(): Map<number, number> {
    return this.referralIndices;
  }

  private iterativeDFS(startNode: number): number {
    let count = 0;
    const visited = new Set<number>();
    const stack: number[] = [startNode];

    while (stack.length > 0) {
      const node = stack.pop()!;

      if (!visited.has(node)) {
        visited.add(node);
        const neighbors = this.adjacencyList.get(node) || [];

        for (const neighbor of neighbors) {
          if (!visited.has(neighbor)) {
            count++;
            stack.push(neighbor);
          }
        }
      }
    }
    return count;
  }

  getAdjacencyList() {
    return this.adjacencyList;
  }

  getReferralIndices() {
    return this.referralIndices;
  }
}
