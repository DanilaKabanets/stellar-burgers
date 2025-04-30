import { RootState } from '../store';
import { TIngredient } from '../../utils/types';

// Селектор для получения всех ингредиентов
export const selectIngredients = (state: RootState): TIngredient[] =>
  state.ingredients.ingredients;

// Селектор для получения статуса загрузки ингредиентов
export const selectIngredientsLoading = (state: RootState): boolean =>
  state.ingredients.loading;

// Селектор для получения ошибки при загрузке ингредиентов
export const selectIngredientsError = (state: RootState): string | null =>
  state.ingredients.error;
