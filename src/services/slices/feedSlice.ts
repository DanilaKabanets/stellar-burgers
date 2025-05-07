import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrdersData } from '@utils-types';
import { getFeedsApi } from '@api';
import { RootState } from '../store';

export type TFeedState = {
  feed: TOrdersData;
  loading: boolean;
  error: string | null;
};

export const initialState: TFeedState = {
  feed: {
    orders: [],
    total: 0,
    totalToday: 0
  },
  loading: false,
  error: null
};

export const getFeedApi = createAsyncThunk('feed/getFeed', async () => {
  const response = await getFeedsApi();
  return response;
});

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFeedApi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFeedApi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
      })
      .addCase(getFeedApi.fulfilled, (state, action) => {
        state.loading = false;
        state.feed = action.payload;
        state.error = null;
      });
  }
});

export const feedReduce = feedSlice.reducer;
export const getFeed = (state: RootState) => state.feed.feed;
export const getFeedLoading = (state: RootState) => state.feed.loading;
