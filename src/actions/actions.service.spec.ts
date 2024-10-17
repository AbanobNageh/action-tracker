import { Test, TestingModule } from "@nestjs/testing";
import { ActionsService } from "./actions.service";
import { DatabaseService } from "../database/database.service";

describe('ActionsService', () => {
  let mockDatabaseService;
  let module: TestingModule;
  let actionsService: ActionsService;
  let mockActionDataSource;

  beforeAll(async () => {
    mockActionDataSource = {
      getNextActionsProbabilityByActionType: jest.fn(),
    };

    mockDatabaseService = {
      loadUserDataSource: jest.fn(),
      loadActionDataSource: jest.fn().mockReturnValue(mockActionDataSource),
      loadReferralRelationshipDataSource: jest.fn(),
    };

    module = await Test.createTestingModule({
      providers: [
        ActionsService,
        {
          provide: DatabaseService,
          useValue: mockDatabaseService,
        },
      ],
    }).compile();

    actionsService = module.get<ActionsService>(ActionsService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(actionsService).toBeDefined();
  });

  describe('getNextActionsProbabilityByActionType', () => {
    let mockActionType;
    let mockResponse;

    beforeEach(() => {
      mockActionType = 'mock-action-type';
      mockResponse = new Map([['next-action', 0.7]]);

      jest.spyOn(mockActionDataSource, 'getNextActionsProbabilityByActionType').mockReturnValueOnce(mockResponse);
    });

    afterEach(() => {
      jest.spyOn(mockActionDataSource, 'getNextActionsProbabilityByActionType').mockRestore();
    });

    it('Should call actionDataSource.getNextActionsProbabilityByActionType with the correct params and return the result.', () => {
      const result = actionsService.getNextActionsProbabilityByActionType(mockActionType);

      expect(mockActionDataSource.getNextActionsProbabilityByActionType).toHaveBeenCalledWith(mockActionType);
      expect(result).toStrictEqual(mockResponse);
    });
  });

});