import { Test, TestingModule } from '@nestjs/testing';
import {
  ValidatorConstraintInterface,
  ValidationArguments,
  isEmpty,
  isArray,
  isString,
} from 'class-validator';
import { IsValidActionTypeRule } from './action.type.validator';
import { DatabaseService } from '../../database/database.service';
import { ActionDataSource } from '../../database/data-sources/data-source';

describe('IsValidActionTypeRule', () => {
  let rule: IsValidActionTypeRule;
  let module: TestingModule;
  let mockActionDataSource;

  beforeAll(async () => {
    mockActionDataSource = {
      isValidActionType: jest.fn(),
    };

    module = await Test.createTestingModule({
      providers: [
        IsValidActionTypeRule,
        {
          provide: DatabaseService,
          useValue: {
            loadActionDataSource: () => mockActionDataSource,
          },
        },
      ],
    }).compile();

    rule = module.get<IsValidActionTypeRule>(IsValidActionTypeRule);
  });

  afterAll(async () => {
    await module.close();
  });

  it('Should be defined', () => {
    expect(rule).toBeDefined();
  });

  it('Should return false if value is empty', async () => {
    const result = await rule.validate(null, {} as ValidationArguments);
    expect(result).toStrictEqual(false);
  });

  it('Should return false if value is not a string', async () => {
    const result = await rule.validate(123 as any, {} as ValidationArguments);
    expect(result).toStrictEqual(false);
  });

  it('Should return false if actionDataSource returns false', async () => {
    mockActionDataSource.isValidActionType.mockReturnValueOnce(false);
    const result = await rule.validate('invalid_action', {} as ValidationArguments);
    expect(result).toStrictEqual(false);
  });

  it('Should return true if value is valid', async () => {
    mockActionDataSource.isValidActionType.mockReturnValueOnce(true);
    const result = await rule.validate('valid_action', {} as ValidationArguments);
    expect(result).toStrictEqual(true);
  });

  it('Should return correct default message for single value', () => {
    const args: ValidationArguments = {
      property: 'actionType',
      object: { actionType: 'invalid_action' },
    } as ValidationArguments;
    const result = rule.defaultMessage(args);
    expect(result).toStrictEqual('actionType must be a valid action type.');
  });

  it('Should return correct default message for array value', () => {
    const args: ValidationArguments = {
      property: 'actionTypes',
      object: { actionTypes: ['invalid_action1', 'invalid_action2'] },
    } as ValidationArguments;
    const result = rule.defaultMessage(args);
    expect(result).toStrictEqual('actionTypes must be an string array, each a valid action type.');
  });
});