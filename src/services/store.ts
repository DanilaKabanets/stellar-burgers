import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from './reducers';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production' // Включаем DevTools только в разработке
});

// Типизация для всего состояния приложения
export type RootState = ReturnType<typeof store.getState>;

// Типизация для диспетчера
export type AppDispatch = typeof store.dispatch;

// Типизированные хуки
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
