import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useAppDispatch, useAppSelector } from '../../services/store';
import {
  getConstructorState,
  getConstructorLoading,
  getOrderModalData,
  createOrder,
  setOrderModalData
} from '../../services/slices/burgerConstructorSlice';
import { useNavigate } from 'react-router-dom';
import { selectUser } from '../../services/slices/userSlice';

export const BurgerConstructor: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);

  const constructorState = useAppSelector(getConstructorState);
  const loading = useAppSelector(getConstructorLoading);
  const orderModalData = useAppSelector(getOrderModalData);

  const onOrderClick = () => {
    if (!constructorState.bun || loading) return;

    if (!user) {
      navigate('/login');
      return;
    }

    const ingredientIds = [
      constructorState.bun._id,
      ...constructorState.ingredients.map((item) => item._id),
      constructorState.bun._id
    ];
    dispatch(createOrder(ingredientIds));
  };

  const closeOrderModal = () => {
    dispatch(setOrderModalData(null));
  };

  const price = useMemo(
    () =>
      (constructorState.bun ? constructorState.bun.price * 2 : 0) +
      constructorState.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorState]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={loading}
      constructorItems={constructorState}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
