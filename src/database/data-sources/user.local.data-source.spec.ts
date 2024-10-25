import { UserLocalDataSource } from './user.local.data-source';
import { User } from '../../core-data/models/user.model';
import { FileSystemUtils } from '../../core-utils/file-system.utils';

describe('UserLocalDataSource', () => {
  let mockUser;
  let mockDoesPathExist: jest.SpyInstance;
  let mockReadFile: jest.SpyInstance;;
  let dataSource: UserLocalDataSource;

  beforeAll(() => {
    mockUser = { id: 1, name: 'test', createdAt: new Date().toISOString() };
    mockDoesPathExist = jest.spyOn(FileSystemUtils, 'doesPathExist').mockReturnValueOnce(true);
    mockReadFile = jest.spyOn(FileSystemUtils, 'readFile').mockReturnValueOnce(
      Buffer.from(JSON.stringify([mockUser])),
    );

    dataSource = new UserLocalDataSource();
  });

  afterAll(() => {
    mockDoesPathExist.mockRestore();
    mockReadFile.mockRestore();
  });

  it('Should be defined', () => {
    expect(dataSource).toBeDefined();
  });

  describe('loadUserDatabaseFromFile', () => {
    beforeEach(() => {
      mockDoesPathExist.mockReturnValueOnce(true);
      mockReadFile.mockReturnValueOnce(
        JSON.stringify([mockUser]),
      );
    });

    afterEach(() => {
      mockDoesPathExist.mockReset();
      mockReadFile.mockReset();
    });

    it('Should throw error if file does not exist', () => {
      mockDoesPathExist.mockReset().mockReturnValueOnce(false);
      expect(() => dataSource.loadUserDatabaseFromFile()).toThrow(
        'User database file does not exist',
      );
    });

    it('Should load users from file', () => {
      mockReadFile.mockReset().mockReturnValueOnce(
        JSON.stringify([mockUser]),
      );
      dataSource.loadUserDatabaseFromFile();
      expect(dataSource.getAll()).toStrictEqual([
        new User(mockUser.id, mockUser.name, new Date(mockUser.createdAt)),
      ]);
    });

    it('Should handle empty file', () => {
      mockReadFile.mockReset().mockReturnValueOnce(
        JSON.stringify([]),
      );
      dataSource.loadUserDatabaseFromFile();
      expect(dataSource.getAll()).toStrictEqual([]);
    });
  });

  describe('getOne', () => {
    beforeEach(() => {
      mockDoesPathExist.mockReturnValueOnce(true);
      mockReadFile.mockReturnValueOnce(
        JSON.stringify([mockUser]),
      );
    });

    afterEach(() => {
      mockDoesPathExist.mockReset();
      mockReadFile.mockReset();
    });

    it('Should return undefined if user is not found', () => {
      mockReadFile.mockReset().mockReturnValueOnce(
        JSON.stringify([]),
      );
      dataSource.loadUserDatabaseFromFile();
      const user = dataSource.getOne(1);
      expect(user).toBeUndefined();
    });

    it('Should return user if found', () => {
      mockReadFile.mockReset().mockReturnValueOnce(
        JSON.stringify([mockUser]),
      );
      dataSource.loadUserDatabaseFromFile();
      const user = dataSource.getOne(1);
      expect(user).toStrictEqual(
        new User(mockUser.id, mockUser.name, new Date(mockUser.createdAt)),
      );
    });
  });

  describe('getAll', () => {
    beforeEach(() => {
      mockDoesPathExist.mockReturnValueOnce(true);
      mockReadFile.mockReturnValueOnce(
        JSON.stringify([mockUser]),
      );
    });

    afterEach(() => {
      mockDoesPathExist.mockReset();
      mockReadFile.mockReset();
    });

    it('Should return all users', () => {
      mockReadFile.mockReset().mockReturnValueOnce(
        JSON.stringify([mockUser]),
      );
      dataSource.loadUserDatabaseFromFile();
      const users = dataSource.getAll();
      expect(users).toStrictEqual([
        new User(mockUser.id, mockUser.name, new Date(mockUser.createdAt)),
      ]);
    });
  });
});
