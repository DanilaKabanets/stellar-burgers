import { feedReduce, initialState, getFeedApi } from '../feedSlice';
import { TOrdersData } from '@utils-types';

describe('feedReduce', () => {
  const mockFeedData: TOrdersData = {
    orders: [
      {
        _id: '123',
        name: 'Тестовый заказ 1',
        status: 'done',
        number: 12345,
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
        ingredients: ['ing1', 'ing2', 'ing3']
      },
      {
        _id: '456',
        name: 'Тестовый заказ 2',
        status: 'pending',
        number: 67890,
        createdAt: '2023-01-02T00:00:00.000Z',
        updatedAt: '2023-01-02T00:00:00.000Z',
        ingredients: ['ing4', 'ing5', 'ing6']
      }
    ],
    total: 100,
    totalToday: 10
  };

  it('должен вернуть начальное состояние', () => {
    expect(feedReduce(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('getFeedApi', () => {
    it('должен обработать getFeedApi.pending', () => {
      const action = { type: getFeedApi.pending.type };
      const state = feedReduce(initialState, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('должен обработать getFeedApi.fulfilled', () => {
      const action = {
        type: getFeedApi.fulfilled.type,
        payload: mockFeedData
      };
      const state = feedReduce(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.feed).toEqual(mockFeedData);
    });

    it('должен обработать getFeedApi.rejected', () => {
      const errorMessage = 'Error fetching feed';
      const action = {
        type: getFeedApi.rejected.type,
        error: { message: errorMessage }
      };
      const state = feedReduce(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });
});
