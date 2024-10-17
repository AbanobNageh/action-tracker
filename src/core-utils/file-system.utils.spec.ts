import { FileSystemUtils } from './file-system.utils';
import * as fs from 'fs';

jest.mock('fs');

describe('FileSystemUtils', () => {
  let mockExistsSync: jest.SpyInstance;
  let mockReadFileSync: jest.SpyInstance;

  beforeAll(() => {
    mockExistsSync = jest.spyOn(fs, 'existsSync').mockReturnValueOnce(true);
    mockReadFileSync = jest.spyOn(fs, 'readFileSync');
  });

  describe('doesPathExists', () => {
    beforeEach(() => {
      mockExistsSync.mockReturnValueOnce(true);
    });

    afterEach(() => {
      mockExistsSync.mockRestore();
    });

    it('Should return true if path exists', () => {
      const result = FileSystemUtils.doesPathExists('path/to/file');
      
      expect(result).toStrictEqual(true);
      expect(fs.existsSync).toHaveBeenCalledWith('path/to/file');
    });

    it('Should return false if path does not exist', () => {
      mockExistsSync.mockReset().mockReturnValueOnce(false);

      const result = FileSystemUtils.doesPathExists('path/to/nonexistent/file');

      expect(result).toStrictEqual(false,);
      expect(fs.existsSync).toHaveBeenCalledWith('path/to/nonexistent/file');
    });
  });

  describe('readFile', () => {
    let mockData;

    beforeEach(() => {
      mockData = Buffer.from('file content');
      mockReadFileSync.mockReturnValueOnce(mockData);
    });

    afterEach(() => {
      mockReadFileSync.mockRestore();
    });

    it('Should read file content', () => {
      const result = FileSystemUtils.readFile('path/to/file');

      expect(result).toStrictEqual(mockData);
      expect(fs.readFileSync).toHaveBeenCalledWith('path/to/file');
    });

    it('Should handle errors during file reading', () => {
      mockReadFileSync.mockReset().mockImplementationOnce(() => {
        throw new Error('Error reading file');
      });

      expect(() =>
        FileSystemUtils.readFile('path/to/nonexistent/file'),
      ).toThrow('Error reading file');
    });
  });
});
