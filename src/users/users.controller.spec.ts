import { Test, TestingModule } from "@nestjs/testing";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { NotFoundException } from '@nestjs/common';
import { UserView } from '../core-data/view/user.view';
import { DatabaseService } from "../database/database.service";

describe('UsersController', () => {
  let mockGetAllUsers: jest.Mock;
  let mockGetAllActions: jest.Mock;
  let mockBuildDataStructure: jest.Mock;
  let mockDatabaseService;
  let module: TestingModule;
  let usersService: UsersService;
  let controller: UsersController;

  beforeAll(async () => {
    mockGetAllUsers = jest.fn();
    mockGetAllActions = jest.fn();
    mockBuildDataStructure = jest.fn();
    mockDatabaseService = {
      loadUserDataSource: jest.fn().mockReturnValue({
        getAll: mockGetAllUsers,
      }),
      loadActionDataSource: jest.fn().mockReturnValue({
        getAll: mockGetAllActions,
      }),
      loadReferralRelationshipDataSource: jest.fn().mockReturnValue({
        buildDataStructure: mockBuildDataStructure,
      }),
    };
    module = await Test.createTestingModule({
      imports: [],
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: DatabaseService,
          useValue: mockDatabaseService,
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    controller = module.get<UsersController>(UsersController);
  });

  afterAll(async () => {
    await module.close();
  });

  it('Should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getUsersReferralIndex', () => {
    let mockResponseMap;
    let mockResponseObject;

    beforeEach(() => {
      mockResponseMap = new Map();
      mockResponseMap.set('user1', 1);
      mockResponseMap.set('user2', 2);
      mockResponseObject = Object.fromEntries(mockResponseMap);

      jest.spyOn(usersService, 'getUsersReferralIndex').mockReturnValueOnce(mockResponseMap);
    });

    afterEach(() => {
      jest.spyOn(usersService, 'getUsersReferralIndex').mockRestore();
    });

    it('Should call getUsersReferralIndex and return the result', () => {
      const result = controller.getUsersReferralIndex();

      expect(usersService.getUsersReferralIndex).toHaveBeenCalled();
      expect(result).toStrictEqual(mockResponseObject);
    });
  });

  describe('getUserById', () => {
    let mockQueryParams;
    let mockUser;
    let mockUserView;

    beforeEach(() => {
      mockQueryParams = { userId: '1' };
      mockUser = { id: '1', name: 'Test User' };
      mockUserView = { id: '1', name: 'Test User' };

      jest.spyOn(usersService, 'getUserById').mockReturnValueOnce(mockUser);
      jest.spyOn(UserView.prototype, 'render').mockReturnValueOnce(mockUserView);
    });

    afterEach(() => {
      jest.spyOn(usersService, 'getUserById').mockRestore();
      jest.spyOn(UserView.prototype, 'render').mockRestore();
    });

    it('Should throw NotFoundException if user is not found', () => {
      jest.spyOn(usersService, 'getUserById').mockReset().mockReturnValueOnce(undefined);

      expect(() => controller.getUserById(mockQueryParams)).toThrow(NotFoundException);
    });

    it('Should return the user if found', () => {
      const result = controller.getUserById(mockQueryParams);

      expect(usersService.getUserById).toHaveBeenCalledWith(mockQueryParams.userId);
      expect(result).toStrictEqual(mockUserView);
    });
  });

  describe('getActionCountByUserId', () => {
    let mockQueryParams;
    let mockActionCount;

    beforeEach(() => {
      mockQueryParams = { userId: '1' };
      mockActionCount = 5;

      jest.spyOn(usersService, 'getActionCountByUserId').mockReturnValueOnce(mockActionCount);
    });

    afterEach(() => {
      jest.spyOn(usersService, 'getActionCountByUserId').mockRestore();
    });

    it('Should return the action count for the user', () => {
      const result = controller.getActionCountByUserId(mockQueryParams);

      expect(usersService.getActionCountByUserId).toHaveBeenCalledWith(mockQueryParams.userId);
      expect(result).toStrictEqual({ count: mockActionCount });
    });
  });
});