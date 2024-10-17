import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { DatabaseService } from '../database/database.service';

describe('UsersService', () => {
  let mockUserDataSource: {
    getOne: jest.Mock;
    getAll: jest.Mock;
  };
  let mockActionDataSource: {
    getAll: jest.Mock;
    getActionsByUserId: jest.Mock;
  };
  let mockReferralRelationshipDataSource: {
    buildDataStructure: jest.Mock;
    getReferralIndexForAllUsers: jest.Mock;
  };
  let mockDatabaseService: {
    loadUserDataSource: jest.Mock;
    loadActionDataSource: jest.Mock;
    loadReferralRelationshipDataSource: jest.Mock;
  };
  let service: UsersService;

  beforeEach(async () => {
    mockUserDataSource = {
      getOne: jest.fn(),
      getAll: jest.fn(),
    };
    mockActionDataSource = {
      getAll: jest.fn(),
      getActionsByUserId: jest.fn(),
    };
    mockReferralRelationshipDataSource = {
      buildDataStructure: jest.fn(),
      getReferralIndexForAllUsers: jest.fn(),
    };
    mockDatabaseService = {
      loadUserDataSource: jest.fn().mockReturnValue(mockUserDataSource),
      loadActionDataSource: jest.fn().mockReturnValue(mockActionDataSource),
      loadReferralRelationshipDataSource: jest.fn().mockReturnValue(mockReferralRelationshipDataSource),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: DatabaseService,
          useValue: mockDatabaseService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('Should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Should call data source methods in constructor', () => {
    expect(mockDatabaseService.loadUserDataSource).toHaveBeenCalled();
    expect(mockDatabaseService.loadActionDataSource).toHaveBeenCalled();
    expect(mockDatabaseService.loadReferralRelationshipDataSource).toHaveBeenCalled();
    expect(mockUserDataSource.getAll).toHaveBeenCalled();
    expect(mockActionDataSource.getAll).toHaveBeenCalled();
    expect(mockReferralRelationshipDataSource.buildDataStructure).toHaveBeenCalledWith(
      mockUserDataSource.getAll.mock.results[0].value,
      mockActionDataSource.getAll.mock.results[0].value
    );
  });

  describe('getUserById', () => {
    let mockUserId;
    let mockUser;

    beforeEach(() => {
      mockUserId = 1;
      mockUser = { id: 1, name: 'Test User' };

      mockUserDataSource.getOne.mockReturnValueOnce(mockUser);
    });

    afterEach(() => {
      mockUserDataSource.getOne.mockRestore();
    });

    it('Should return user by id', () => {  
      const user = service.getUserById(mockUserId);

      expect(mockUserDataSource.getOne).toHaveBeenCalledWith(mockUserId);
      expect(user).toStrictEqual(mockUser);
    });
  });

  describe('getActionCountByUserId', () => {
    let mockUserId;
    let mockActions;

    beforeEach(() => {
      mockUserId = 1;
      mockActions = [{ type: 'action1' }, { type: 'action2' }];

      mockActionDataSource.getActionsByUserId.mockReturnValueOnce(mockActions);
    });

    afterEach(() => {
      mockActionDataSource.getActionsByUserId.mockRestore();
    });

    it('Should return action count for user', () => {  
      const count = service.getActionCountByUserId(mockUserId);
  
      expect(mockActionDataSource.getActionsByUserId).toHaveBeenCalledWith(mockUserId);
      expect(count).toStrictEqual(mockActions.length);
    });
  });

  describe('getUsersReferralIndex', () => {
    let mockReferralIndex;
    
    beforeEach(() => {
      mockReferralIndex = new Map([['user1', 1], ['user2', 2]]);
    
      mockReferralRelationshipDataSource.getReferralIndexForAllUsers.mockReturnValueOnce(mockReferralIndex);
    });

    afterEach(() => {
      mockReferralRelationshipDataSource.getReferralIndexForAllUsers.mockRestore();
    });

    it('Should return users referral index', () => {
      const referralIndex = service.getUsersReferralIndex();

      expect(mockReferralRelationshipDataSource.getReferralIndexForAllUsers).toHaveBeenCalled();
      expect(referralIndex).toStrictEqual(mockReferralIndex);
    });
  });
});