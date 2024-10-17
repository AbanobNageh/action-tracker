import { Test, TestingModule } from "@nestjs/testing";
import { ActionsController } from "./actions.controller";
import { ActionsService } from "./actions.service";
import { DatabaseService } from "../database/database.service";

describe('ActionsController', () => {
  let mockDatabaseService;
  let module: TestingModule;
  let actionsService: ActionsService;
  let controller: ActionsController;

  beforeAll(async() => {
    process.env.DATA_SOUCE_TYPE = 'local';
    process.env.REFERRAL_DATA_SOURCE_TYPE = 'graph';

    mockDatabaseService = {
      loadUserDataSource: jest.fn(),
      loadActionDataSource: jest.fn(),
      loadReferralRelationshipDataSource: jest.fn(),
    };
    module = await Test.createTestingModule({
      imports: [],
      controllers: [ActionsController],
      providers: [
        ActionsService,
        {
          provide: DatabaseService,
          useValue: mockDatabaseService,
        }
      ],
    }).compile();

    actionsService = module.get<ActionsService>(ActionsService);
    controller = module.get<ActionsController>(ActionsController);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('GetNextActionsByActionType', () => {
    let mockQueryParams;
    let mockResponseMap;
    let mockResponseObject;

    beforeEach(() => {
      mockQueryParams = {
        actionType: 'mock-action-type',
      };
      mockResponseMap = new Map();
      mockResponseMap.set('mock-action', 0.5);
      mockResponseObject = Object.fromEntries(mockResponseMap);

      jest.spyOn(actionsService, 'getNextActionsProbabilityByActionType').mockReturnValueOnce(mockResponseMap);
    });

    afterEach(() => {
      jest.spyOn(actionsService, 'getNextActionsProbabilityByActionType').mockRestore();
    });

    it('Should call the correct functions with the correct params.', () => {
      const result = controller.GetNextActionsByActionType(mockQueryParams);

      expect(actionsService.getNextActionsProbabilityByActionType).toHaveBeenCalledWith(mockQueryParams.actionType);
      expect(result).toStrictEqual(mockResponseObject);
    });
  });
});