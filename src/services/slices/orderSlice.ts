import { TOrder } from '@utils-types';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getOrdersApi, getOrderByNumberApi } from '@api';
import { RootState } from '../store';

export type TOrderState = {
  orders: TOrder[];
  currentOrder: TOrder | null;
  error: string | null;
  loading: boolean;
};

export const initialState: TOrderState = {
  orders: [],
  currentOrder: null,
  error: null,
  loading: false
};

export const getOrderByNumber = createAsyncThunk(
  'orders/getOrderByNumber',
  async (number: number) => {
    const response = await getOrderByNumberApi(number);
    if (!response.success) {
      throw new Error('Не удалось получить данные заказа');
    }
    return response;
  }
);

export const getOrder = createAsyncThunk('order/getOrders', async () =>
  getOrdersApi()
);

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getOrder.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(getOrder.rejected, (state, action) => {
        state.error = action.error.message as string;
        state.loading = false;
      })
      .addCase(getOrder.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.loading = false;
        state.error = null;
      });

    builder
      .addCase(getOrderByNumber.pending, (state) => {
        state.currentOrder = null;
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.error = action.error.message as string;
        state.loading = false;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.currentOrder = action.payload.orders[0];
        state.loading = false;
        state.error = null;
      });
  }
});

export const getCurrentOrder = (state: RootState) => state.order.currentOrder;
export const getLoadingSelector = (state: RootState) => state.order.loading;
export const orderReducer = orderSlice.reducer;
