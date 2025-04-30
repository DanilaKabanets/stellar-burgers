import { TConstructorIngredient, TIngredient, TOrder } from '@utils-types';
import {
  createSlice,
  PayloadAction,
  nanoid,
  createAsyncThunk
} from '@reduxjs/toolkit';
import { orderBurgerApi } from '@api';
import { RootState } from '../store';

export type TConstructorState = {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
  orderModalData: TOrder | null;
  error: string | null;
  loading: boolean;
};

export const initialState: TConstructorState = {
  bun: null,
  ingredients: [],
  orderModalData: null,
  error: null,
  loading: false
};

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (ingredients: string[]) => {
    const response = await orderBurgerApi(ingredients);
    return response.order;
  }
);

export const constructorSlice = createSlice({
  name: 'constructorBurger',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.bun = action.payload;
        } else {
          state.ingredients.push(action.payload);
        }
      },
      prepare: (ingredients: TIngredient) => {
        const key = nanoid();
        return { payload: { ...ingredients, id: key } };
      }
    },
    removeIngredient(state, action: PayloadAction<string>) {
      state.ingredients = state.ingredients.filter(
        (ingredient) => ingredient.id !== action.payload
      );
    },
    moveIngredientPosition: (
      state,
      action: PayloadAction<{ index: number; newIndex: number }>
    ) => {
      const { index, newIndex } = action.payload;
      [state.ingredients[index], state.ingredients[index + newIndex]] = [
        state.ingredients[index + newIndex],
        state.ingredients[index]
      ];
    },
    setOrderModalData: (state, action: PayloadAction<TOrder | null>) => {
      if (!action.payload) {
        state.ingredients = [];
        state.bun = null;
      }
      state.orderModalData = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.error = action.error.message as string;
        state.loading = false;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderModalData = action.payload;
        state.loading = false;
        state.error = null;
      });
  }
});

export const {
  addIngredient,
  removeIngredient,
  moveIngredientPosition,
  setOrderModalData
} = constructorSlice.actions;
export const constructorReduce = constructorSlice.reducer;

export const getConstructorState = (state: RootState): TConstructorState =>
  state.constructorBurger;
export const getOrderModalData = (state: RootState): TOrder | null =>
  state.constructorBurger.orderModalData;
export const getConstructorLoading = (state: RootState): boolean =>
  state.constructorBurger.loading;
