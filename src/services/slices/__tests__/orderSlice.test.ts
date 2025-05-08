import {
  orderReducer,
  initialState,
  getOrder,
  getOrderByNumber
} from '../orderSlice';
import { TOrder } from '@utils-types';

describe('orderReducer', () => {
  const mockOrder: TOrder = {
    _id: '123',
    number: 1234,
    name: 'Тестовый заказ',
    status: 'done',
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z',
    ingredients: ['ing1', 'ing2', 'ing3']
  };

  const mockOrders: TOrder[] = [mockOrder];

  it('должен вернуть начальное состояние', () => {
    expect(orderReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('getOrder', () => {
    it('должен обработать getOrder.pending', () => {
      const action = { type: getOrder.pending.type };
      const state = orderReducer(initialState, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('должен обработать getOrder.fulfilled', () => {
      const action = {
        type: getOrder.fulfilled.type,
        payload: mockOrders
      };
      const state = orderReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.orders).toEqual(mockOrders);
    });

    it('должен обработать getOrder.rejected', () => {
      const errorMessage = 'Error fetching orders';
      const action = {
        type: getOrder.rejected.type,
        error: { message: errorMessage }
      };
      const state = orderReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });

  describe('getOrderByNumber', () => {
    it('должен обработать getOrderByNumber.pending', () => {
      const action = { type: getOrderByNumber.pending.type };
      const state = orderReducer(initialState, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
      expect(state.currentOrder).toBeNull();
    });

    it('должен обработать getOrderByNumber.fulfilled', () => {
      const action = {
        type: getOrderByNumber.fulfilled.type,
        payload: { orders: [mockOrder], success: true }
      };
      const state = orderReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.currentOrder).toEqual(mockOrder);
    });

    it('должен обработать getOrderByNumber.rejected', () => {
      const errorMessage = 'Error fetching order';
      const action = {
        type: getOrderByNumber.rejected.type,
        error: { message: errorMessage }
      };
      const state = orderReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });
});
