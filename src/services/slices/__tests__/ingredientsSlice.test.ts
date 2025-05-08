import {
  ingredientReduce,
  initialState,
  getIngredients
} from '../ingredientsSlice';
import { TIngredient } from '@utils-types';

describe('ingredientReduce', () => {
  const mockIngredients: TIngredient[] = [
    {
      _id: '123',
      name: 'Тестовый ингредиент 1',
      type: 'main',
      proteins: 10,
      fat: 20,
      carbohydrates: 30,
      calories: 100,
      price: 50,
      image: 'url1',
      image_mobile: 'url1',
      image_large: 'url1'
    },
    {
      _id: '456',
      name: 'Тестовый ингредиент 2',
      type: 'bun',
      proteins: 5,
      fat: 10,
      carbohydrates: 15,
      calories: 200,
      price: 100,
      image: 'url2',
      image_mobile: 'url2',
      image_large: 'url2'
    }
  ];

  it('должен вернуть начальное состояние', () => {
    expect(ingredientReduce(undefined, { type: 'unknown' })).toEqual(
      initialState
    );
  });

  describe('extraReducers', () => {
    it('должен обработать getIngredients.pending', () => {
      const action = { type: getIngredients.pending.type };
      const state = ingredientReduce(initialState, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('должен обработать getIngredients.fulfilled', () => {
      const action = {
        type: getIngredients.fulfilled.type,
        payload: mockIngredients
      };
      const state = ingredientReduce(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.ingredients).toEqual(mockIngredients);
    });

    it('должен обработать getIngredients.rejected', () => {
      const errorMessage = 'Error fetching ingredients';
      const action = {
        type: getIngredients.rejected.type,
        error: { message: errorMessage }
      };
      const state = ingredientReduce(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });
});
