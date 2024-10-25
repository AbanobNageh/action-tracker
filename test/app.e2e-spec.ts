import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { useContainer } from 'class-validator';

describe('Action Tracker (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    process.env.DATA_SOUCE_TYPE = 'local';
    process.env.REFERRAL_DATA_SOURCE_TYPE = 'graph';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    useContainer(app.select(AppModule), { fallbackOnErrors: true });
    await app.init();
  });

  describe('Users endpoints', () => {
    describe('/:userId (GET)', () => {
      it('/:userId (GET) - invalid user id.', () => {
        return request(app.getHttpServer())
          .get('/users/aa')
          .expect(400)
          .expect({
            statusCode: 400,
            message: 'Some of the request data is invalid.',
            validationErrors: [
              'userId must not be less than 0',
              'userId must be a number conforming to the specified constraints',
            ],
            error: 'Bad Request',
          });
      });

      it('/:userId (GET) - Valid but non-existant user.', () => {
        return request(app.getHttpServer())
          .get('/users/999999')
          .expect(404)
          .expect({
            statusCode: 404,
            error: "Not Found",
            message: "User not found"
        });
      });

      it('/:userId (GET)', () => {
        return request(app.getHttpServer()).get('/users/1').expect(200).expect({
          id: 1,
          name: 'Ferdinande',
          createdAt: '2020-07-14T05:48:54.798Z',
        });
      });
    });

    describe('/:userId/action-count (GET)', () => {
      it('/:userId/action-count (GET) - invalid user id.', () => {
        return request(app.getHttpServer())
          .get('/users/a/action-count')
          .expect(400)
          .expect({
            statusCode: 400,
            message: 'Some of the request data is invalid.',
            validationErrors: [
              'userId must not be less than 0',
              'userId must be a number conforming to the specified constraints',
            ],
            error: 'Bad Request',
          });
      });

      it('/:userId/action-count (GET) - Valid but non-existant user.', () => {
        return request(app.getHttpServer())
          .get('/users/999999/action-count')
          .expect(404)
          .expect({
            statusCode: 404,
            error: "Not Found",
            message: "User not found"
        });
      });

      it('/:userId/action-count (GET)', () => {
        return request(app.getHttpServer())
          .get('/users/1/action-count')
          .expect(200)
          .expect({
            count: 49,
          });
      });
    });

    it('/referral-index (GET)', () => {
      return request(app.getHttpServer())
        .get('/users/referral-index')
        .expect(200)
        .then((response) => {
          expect(Object.keys(response.body).length).toStrictEqual(1000);
          expect(response.body['1']).toStrictEqual(1);
          expect(response.body['35']).toStrictEqual(4);
        });
    });
  });

  describe('Actions endpoints', () => {
    describe('/:actionType/next-actions (GET)', () => {
      it('/:actionType/next-actions (GET) - invalid action type.', () => {
        return request(app.getHttpServer())
          .get('/actions/a/next-actions')
          .expect(400)
          .expect({
            statusCode: 400,
            message: 'Some of the request data is invalid.',
            validationErrors: ['actionType must be a valid action type.'],
            error: 'Bad Request',
          });
      });

      it('/:actionType/next-actions (GET)', () => {
        return request(app.getHttpServer())
          .get('/actions/WELCOME/next-actions')
          .expect(200)
          .expect({
            WELCOME: 0.16805845511482254,
            CONNECT_CRM: 0.06680584551148225,
            EDIT_CONTACT: 0.2630480167014614,
            ADD_CONTACT: 0.23382045929018788,
            VIEW_CONTACTS: 0.25260960334029225,
            REFER_USER: 0.015657620041753653,
          });
      });
    });
  });
});
