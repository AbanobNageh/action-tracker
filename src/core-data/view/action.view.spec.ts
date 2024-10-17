import { ActionView } from "./action.view";
import { Action } from "../models/action.model";

describe('ActionView', () => {
  let actionData: Action | Action[];
  let actionView: ActionView;

  describe('Render single Action', () => {
    beforeEach(() => {
      actionData = {
        id: 1,
        type: 'mock-type',
        userId: 123,
        targetUser: 456,
        createdAt: new Date(),
      };
      actionView = new ActionView(actionData);
    });

    it('Should render a single ActionView correctly', () => {
      const expectedView = {
        id: 1,
        type: 'mock-type',
        userId: 123,
        targetUser: 456,
        createdAt: (actionData as Action).createdAt,
      };

      expect(actionView.render()).toStrictEqual(expectedView);
    });
  });

  describe('Render multiple Actions', () => {
    beforeEach(() => {
      actionData = [
        {
          id: 1,
          type: 'mock-type-1',
          userId: 123,
          targetUser: 456,
          createdAt: new Date(),
        },
        {
          id: 2,
          type: 'mock-type-2',
          userId: 789,
          targetUser: 101,
          createdAt: new Date(),
        },
      ];
      actionView = new ActionView(actionData);
    });

    it('Should render a list of ActionViews correctly', () => {
      const expectedView = [
        {
          id: 1,
          type: 'mock-type-1',
          userId: 123,
          targetUser: 456,
          createdAt: actionData[0].createdAt,
        },
        {
          id: 2,
          type: 'mock-type-2',
          userId: 789,
          targetUser: 101,
          createdAt: actionData[1].createdAt,
        },
      ];

      expect(actionView.render()).toStrictEqual(expectedView);
    });
  });

  describe('Render with empty array', () => {
    beforeEach(() => {
      actionData = [];
      actionView = new ActionView(actionData);
    });

    it('Should render an empty array if actionData is empty', () => {
       expect(actionView.render()).toStrictEqual([]);
    });
  });
});