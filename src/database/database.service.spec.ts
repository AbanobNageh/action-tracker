import { Test, TestingModule } from "@nestjs/testing";
import { DatabaseService } from "./database.service";
import { ModuleRef } from '@nestjs/core';
import { ActionLocalDataSource } from './data-sources/action.local.data-source';
import { UserLocalDataSource } from './data-sources/user.local.data-source';
import { GraphReferralRelationshipDataSource } from './data-sources/graph.referral.relationship.data-source';


describe('DatabaseService', () => {
  let mockModuleRef: { get: jest.Mock };
  let databaseService: DatabaseService;
  let module: TestingModule;

  beforeAll(async () => {
    mockModuleRef = {
      get: jest.fn(),
    };

    module = await Test.createTestingModule({
      providers: [
        DatabaseService,
        {
          provide: ModuleRef,
          useValue: mockModuleRef,
        },
        {
          provide: ActionLocalDataSource,
          useValue: {},
        },
        {
          provide: UserLocalDataSource,
          useValue: {},
        },
        {
          provide: GraphReferralRelationshipDataSource,
          useValue: {},
        },
      ],
    }).compile();

    databaseService = module.get<DatabaseService>(DatabaseService);
  });

  afterAll(async () => {
    await module.close();
  });


  it('Should be defined', () => {
    expect(databaseService).toBeDefined();
  });

  describe('loadUserDataSource', () => {
    let mockUserLocalDataSource;

    beforeEach(() => {
      process.env.DATA_SOUCE_TYPE = 'local';
      mockUserLocalDataSource = {};

      mockModuleRef.get.mockReturnValue(mockUserLocalDataSource);
    });

    afterEach(() => {
      mockModuleRef.get.mockRestore();
    });

    it('Should return UserLocalDataSource when DATA_SOUCE_TYPE is local', () => {
      const result = databaseService.loadUserDataSource();

      expect(mockModuleRef.get).toHaveBeenCalledWith(UserLocalDataSource, { strict: false });
      expect(result).toStrictEqual(mockUserLocalDataSource);
    });


    it('Should throw error when DATA_SOUCE_TYPE is not defined.', () => {
      delete process.env.DATA_SOUCE_TYPE
      
      expect(() => databaseService.loadUserDataSource()).toThrow('Invalid user data source type');
    });
  });

  describe('loadActionDataSource', () => {
    let mockActionLocalDataSource;

    beforeEach(() => {
      process.env.DATA_SOUCE_TYPE = 'local';
      mockActionLocalDataSource = {};

      mockModuleRef.get.mockReturnValueOnce(mockActionLocalDataSource);
    });

    afterEach(() => {
      mockModuleRef.get.mockRestore();
    });

    it('Should return ActionLocalDataSource when DATA_SOUCE_TYPE is local', () => {
      const result = databaseService.loadActionDataSource();

      expect(mockModuleRef.get).toHaveBeenCalledWith(ActionLocalDataSource, { strict: false });
      expect(result).toStrictEqual(mockActionLocalDataSource);
    });

    it('Should throw error when DATA_SOUCE_TYPE is not defined.', () => {
      delete process.env.DATA_SOUCE_TYPE;

      expect(() => databaseService.loadActionDataSource()).toThrow('Invalid action data source type');
    });
  });

  describe('loadReferralRelationshipDataSource', () => {
    let mockGraphReferralRelationshipDataSource;

    beforeEach(() => {
      process.env.REFERRAL_DATA_SOURCE_TYPE = 'graph';
      mockGraphReferralRelationshipDataSource = {};

      mockModuleRef.get.mockReturnValue(mockGraphReferralRelationshipDataSource);
    });

    afterEach(() => {
      mockModuleRef.get.mockRestore();
    });

    it('Should return GraphReferralRelationshipDataSource when REFERRAL_DATA_SOURCE_TYPE is graph', () => {
      const result = databaseService.loadReferralRelationshipDataSource();

      expect(mockModuleRef.get).toHaveBeenCalledWith(GraphReferralRelationshipDataSource, { strict: false });
      expect(result).toStrictEqual(mockGraphReferralRelationshipDataSource);
    });


    it('Should throw error when REFERRAL_DATA_SOURCE_TYPE is not defined.', () => {
      delete process.env.REFERRAL_DATA_SOURCE_TYPE;

      expect(() => databaseService.loadReferralRelationshipDataSource()).toThrow('Invalid action data source type');
    });
  });
});