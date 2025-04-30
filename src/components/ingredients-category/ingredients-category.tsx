import { forwardRef, useMemo } from 'react';
import { TIngredientsCategoryProps } from './type';
import { TIngredient } from '@utils-types';
import { IngredientsCategoryUI } from '../ui/ingredients-category';
import { useAppDispatch, useAppSelector } from '../../services/store';
import { getConstructorState } from '../../services/slices/burgerConstructorSlice';
import { addIngredient } from '../../services/slices/burgerConstructorSlice';

export const IngredientsCategory = forwardRef<
  HTMLUListElement,
  TIngredientsCategoryProps
>(({ title, titleRef, ingredients }, ref) => {
  const dispatch = useAppDispatch();
  const constructorState = useAppSelector(getConstructorState);

  const ingredientsCounters = useMemo(() => {
    const { bun, ingredients } = constructorState;
    const counters: { [key: string]: number } = {};
    ingredients.forEach((ingredient) => {
      if (!counters[ingredient._id]) counters[ingredient._id] = 0;
      counters[ingredient._id]++;
    });
    if (bun) counters[bun._id] = 2;
    return counters;
  }, [constructorState]);

  const handleIngredientClick = (ingredient: TIngredient) => {
    dispatch(addIngredient(ingredient));
  };

  return (
    <IngredientsCategoryUI
      title={title}
      titleRef={titleRef}
      ingredients={ingredients}
      ingredientsCounters={ingredientsCounters}
      ref={ref}
      handleIngredientClick={handleIngredientClick}
    />
  );
});
