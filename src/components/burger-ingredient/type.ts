import { TIngredient } from '@utils-types';

export type TBurgerIngredientProps = {
  ingredient: TIngredient;
  count: number;
  handleAddIngredient?: (ingredient: TIngredient) => void;
};
