import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../services/store';
import { getOrder } from '../../services/slices/orderSlice';
import { RootState } from '../../services/store';

export const ProfileOrders: FC = () => {
  const dispatch = useAppDispatch();
  const orders = useAppSelector((state: RootState) => state.order.orders);

  useEffect(() => {
    dispatch(getOrder());
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
