import {
  GlobalExceptionFilteer,
} from './global.exception.filter';
import {
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

describe('GlobalExceptionFilteer', () => {
  let filter: GlobalExceptionFilteer;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;
  let mockResponse: Partial<Response>;
  let mockContext: { getResponse: () => Partial<Response> };
  let mockHost: { switchToHttp: () => { getResponse: () => Partial<Response> } };

  beforeEach(() => {
    filter = new GlobalExceptionFilteer();
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    mockResponse = {
      status: mockStatus,
      json: mockJson,
    };
    mockContext = { getResponse: () => mockResponse };
    mockHost = { switchToHttp: () => mockContext };
  });

  it('Should be defined', () => {
    expect(filter).toBeDefined();
  });

  it('Should catch a generic exception and return 500', () => {
    const mockException = new Error('Generic Error');

    filter.catch(mockException, mockHost as ArgumentsHost);

    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(mockJson).toHaveBeenCalledWith({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      error: 'Internal Server Error',
    });
  });

  it('Should catch a HttpException and return the correct status code and message', () => {
    const mockException = new HttpException(
      'Test Exception',
      HttpStatus.BAD_GATEWAY,
    );

    filter.catch(mockException, mockHost as ArgumentsHost);

    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.BAD_GATEWAY);
    expect(mockJson).toHaveBeenCalledWith({
      message: "Test Exception",
      statusCode: HttpStatus.BAD_GATEWAY,
    });
  });

  it('Should catch a BadRequestException and return the correct format', () => {
    const mockException = new HttpException(
      {
        message: ['Validation error 1', 'Validation error 2'],
        error: 'Bad Request',
      },
      HttpStatus.BAD_REQUEST,
    );

    filter.catch(mockException, mockHost as ArgumentsHost);

    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockJson).toHaveBeenCalledWith({
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Some of the request data is invalid.',
      validationErrors: ['Validation error 1', 'Validation error 2'],
      error: 'Bad Request',
    });
  });

  it('Should handle exceptions during exceptionToServerException and return 500', () => {
    const mockException = {} as unknown as HttpException;
    mockException.getResponse = () => {
      throw new Error('Error during getResponse');
    };

    filter.catch(mockException, mockHost as ArgumentsHost);

    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(mockJson).toHaveBeenCalledWith({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      error: 'Internal Server Error',
    });
  });
});