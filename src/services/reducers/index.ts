import { combineReducers } from 'redux';
import { ingredientReduce } from '../slices/ingredientsSlice';
import { constructorReduce } from '../slices/burgerConstructorSlice';
import { userReducer } from '../slices/userSlice';
import { feedReduce } from '../slices/feedSlice';
import { orderReducer } from '../slices/orderSlice';

// Здесь будут объединяться все редьюсеры приложения
export const rootReducer = combineReducers({
  ingredients: ingredientReduce,
  constructorBurger: constructorReduce,
  user: userReducer,
  feed: feedReduce,
  order: orderReducer
  // другие редьюсеры можно добавить здесь
});
