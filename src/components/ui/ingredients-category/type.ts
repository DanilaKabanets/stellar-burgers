import React, { RefObject } from 'react';
import { TIngredient } from '@utils-types';

export type TIngredientsCategoryUIProps = {
  title: string;
  titleRef: RefObject<HTMLHeadingElement>;
  ingredients: TIngredient[];
  ingredientsCounters: Record<string, number>;
  ref: React.ForwardedRef<HTMLUListElement>;
  handleIngredientClick: (ingredient: TIngredient) => void;
};
