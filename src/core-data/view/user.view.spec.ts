import { UserView } from "./user.view";
import { User } from "../models/user.model";

describe('UserView', () => {
  let userData: User | User[];
  let userView: UserView;

  describe('Render single User', () => {
    beforeEach(() => {
      userData = {
        id: 1,
        name: 'Test User',
        createdAt: new Date(),
      };
      userView = new UserView(userData);
    });

    it('Should render a single UserView correctly', () => {
      const expectedView = {
        id: 1,
        name: 'Test User',
        createdAt: (userData as User).createdAt,
      };

      expect(userView.render()).toStrictEqual(expectedView);
    });
  });

  describe('Render multiple Users', () => {
    beforeEach(() => {
      userData = [
        {
          id: 1,
          name: 'Test User 1',
          createdAt: new Date(),
        },
        {
          id: 2,
          name: 'Test User 2',
          createdAt: new Date(),
        },
      ];
      userView = new UserView(userData);
    });

    it('Should render a list of UserViews correctly', () => {
      const expectedView = [
        {
          id: 1,
          name: 'Test User 1',
          createdAt: userData[0].createdAt,
        },
        {
          id: 2,
          name: 'Test User 2',
          createdAt: userData[1].createdAt,
        },
      ];

      expect(userView.render()).toStrictEqual(expectedView);
    });
  });


  describe('Render with empty array', () => {
    beforeEach(() => {
      userData = [];
      userView = new UserView(userData);
    });

    it('Should render an empty array if userData is empty', () => {
       expect(userView.render()).toStrictEqual([]);
    });
  });
});