import { ActionLocalDataSource } from './action.local.data-source';
import { Action } from '../../core-data/models/action.model';
import { FileSystemUtils } from '../../core-utils/file-system.utils';

describe('ActionLocalDataSource', () => {
  let mockAction;
  let mockDoesPathExist: jest.SpyInstance;
  let mockReadFile: jest.SpyInstance;
  let dataSource: ActionLocalDataSource;

  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-10-17T18:27:36.186Z'));
    mockAction = {
      id: 1,
      type: 'test',
      userId: 1,
      targetUser: 2,
      createdAt: '2024-10-17T18:27:36.186Z',
    };
    mockDoesPathExist = jest.spyOn(FileSystemUtils, 'doesPathExist').mockReturnValue(true);
    mockReadFile = jest.spyOn(FileSystemUtils, 'readFile').mockReturnValue(Buffer.from(JSON.stringify([mockAction])));

    dataSource = new ActionLocalDataSource();
  });

  beforeEach(() => {
    mockDoesPathExist.mockReset().mockReturnValue(true);
    mockReadFile.mockReset().mockReturnValue(Buffer.from(JSON.stringify([mockAction])));

    dataSource.loadActionDatabaseFromFile();
  });

  afterAll(() => {
    jest.useRealTimers();
    mockDoesPathExist.mockRestore();
    mockReadFile.mockRestore();
  });

  it('Should be defined', () => {
    expect(dataSource).toBeDefined();
  });

  describe('loadActionDatabaseFromFile', () => {
    it('Should throw error if file does not exist', () => {
      mockDoesPathExist.mockReset().mockReturnValueOnce(false);

      expect(() => dataSource.loadActionDatabaseFromFile()).toThrow(
        'Action database file does not exist',
      );
    });

    it('Should load actions from file', () => {
      mockReadFile.mockReset().mockReturnValueOnce(JSON.stringify([mockAction]));

      dataSource.loadActionDatabaseFromFile();
      
      expect(dataSource.getAll()).toStrictEqual([
        new Action(
          mockAction.id,
          mockAction.type,
          mockAction.userId,
          mockAction.targetUser,
          new Date(mockAction.createdAt),
        ),
      ]);
      expect(dataSource.isValidActionType(mockAction.type)).toStrictEqual(true);
    });

    it('Should handle empty file', () => {
      mockReadFile.mockReset().mockReturnValueOnce(JSON.stringify([]));

      dataSource.loadActionDatabaseFromFile();
      
      expect(dataSource.getAll()).toStrictEqual([]);
    });

    it('Should sort actions by createdAt', () => {
      const mockActions = [
        {
          ...mockAction,
          id: 2,
          createdAt: new Date(Date.now() + 1000).toISOString(),
        },
        { ...mockAction, id: 1, createdAt: new Date(Date.now()).toISOString() },
      ];
      mockReadFile.mockReset().mockReturnValueOnce(JSON.stringify(mockActions));

      dataSource.loadActionDatabaseFromFile();
      
      expect(dataSource.getAll()[0].id).toStrictEqual(1);
      expect(dataSource.getAll()[1].id).toStrictEqual(2);
    });
  });

  describe('getOne', () => {
    it('Should return undefined if action is not found', () => {
      const action = dataSource.getOne(2);

      expect(action).toBeUndefined();
    });

    it('Should return action if found', () => {
      const action = dataSource.getOne(1);

      expect(action).toStrictEqual(
        new Action(
          mockAction.id,
          mockAction.type,
          mockAction.userId,
          mockAction.targetUser,
          new Date(mockAction.createdAt),
        ),
      );
    });
  });

  describe('getActionsByUserId', () => {
    it('Should return actions for user', () => {
      const actions = dataSource.getActionsByUserId(1);
      expect(actions).toStrictEqual([
        new Action(
          mockAction.id,
          mockAction.type,
          mockAction.userId,
          mockAction.targetUser,
          new Date(mockAction.createdAt),
        ),
      ]);
    });
    it('Should return empty array if no actions found for user', () => {
      const actions = dataSource.getActionsByUserId(2);

      expect(actions).toStrictEqual([]);
    });
  });

  describe('getNextActionsProbabilityByActionType', () => {
    it('Should calculate and cache probabilities', () => {
      const probabilities = dataSource.getNextActionsProbabilityByActionType('test');

      expect(probabilities).toBeDefined();
    });
  });

  describe('getAll', () => {
    it('Should return all actions', () => {
      const actions = dataSource.getAll();

      expect(actions).toStrictEqual([
        new Action(
          mockAction.id,
          mockAction.type,
          mockAction.userId,
          mockAction.targetUser,
          new Date(mockAction.createdAt),
        ),
      ]);
    });
  });

  describe('isValidActionType', () => {
    it('Should return true for valid action type', () => {
      expect(dataSource.isValidActionType('test')).toStrictEqual(true);
    });

    it('Should return false for invalid action type', () => {
      expect(dataSource.isValidActionType('invalid')).toStrictEqual(false);
    });
  });
});
