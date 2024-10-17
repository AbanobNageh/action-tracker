import { GraphReferralRelationshipDataSource } from './graph.referral.relationship.data-source';
import { User } from '../../core-data/models/user.model';
import { Action } from '../../core-data/models/action.model';

describe('GraphReferralRelationshipDataSource', () => {
  let dataSource: GraphReferralRelationshipDataSource;
  let mockUsers: User[];
  let mockActions: Action[];

  beforeEach(() => {
    dataSource = new GraphReferralRelationshipDataSource();
    mockUsers = [
      new User(1, 'User 1', new Date()),
      new User(2, 'User 2', new Date()),
      new User(3, 'User 3', new Date()),
      new User(4, 'User 4', new Date()),
    ];
    mockActions = [
      new Action(1, 'REFER_USER', 1, 4, new Date()),
      new Action(2, 'REFER_USER', 1, 3, new Date()),
      new Action(3, 'OTHER_ACTION', 2, undefined, new Date()),
      new Action(4, 'REFER_USER', 2, 1, new Date()),
    ];
  });

  it('should be defined', () => {
    expect(dataSource).toBeDefined();
  });

  describe('buildDataStructure', () => {
    it('Should build the adjacency list and referral indices', () => {
      dataSource.buildDataStructure(mockUsers, mockActions);
      expect(dataSource.getAdjacencyList().get(1)).toStrictEqual([4, 3]);
      expect(dataSource.getAdjacencyList().get(2)).toStrictEqual([1]);
      expect(dataSource.getAdjacencyList().get(3)).toStrictEqual([]);
      expect(dataSource.getAdjacencyList().get(4)).toStrictEqual([]);
      expect(dataSource.getReferralIndexByUserId(1)).toStrictEqual(2);
      expect(dataSource.getReferralIndexByUserId(2)).toStrictEqual(3);
      expect(dataSource.getReferralIndexByUserId(3)).toStrictEqual(0);
      expect(dataSource.getReferralIndexByUserId(3)).toStrictEqual(0);
    });

    it('Should handle empty users and actions', () => {
      dataSource.buildDataStructure([], []);
      expect(dataSource.getAdjacencyList().size).toStrictEqual(0);
      expect(dataSource.getReferralIndices().size).toStrictEqual(0);
    });

    it('Should only process REFER_USER actions', () => {
      dataSource.buildDataStructure(mockUsers, [
        new Action(1, 'OTHER_ACTION', 1, 2, new Date()),
      ]);
      expect(dataSource.getAdjacencyList().get(1)).toStrictEqual([]);
    });
  });

  describe('getReferralIndexByUserId', () => {
    it('Should return the referral index for a given user', () => {
      dataSource.buildDataStructure(mockUsers, mockActions);
      expect(dataSource.getReferralIndexByUserId(1)).toStrictEqual(2);
    });
  });

  describe('getReferralIndexForAllUsers', () => {
    it('Should return the referral indices for all users', () => {
      dataSource.buildDataStructure(mockUsers, mockActions);
      const referralIndices = dataSource.getReferralIndexForAllUsers();
      expect(referralIndices.size).toStrictEqual(mockUsers.length);
    });
  });
});
