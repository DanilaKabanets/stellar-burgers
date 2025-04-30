import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../services/store';
import {
  getFeed,
  getFeedApi,
  getFeedLoading
} from '../../services/slices/feedSlice';

export const Feed: FC = () => {
  const dispatch = useAppDispatch();
  const { orders, total, totalToday } = useAppSelector(getFeed);
  const loading = useAppSelector(getFeedLoading);

  useEffect(() => {
    dispatch(getFeedApi());
  }, [dispatch]);

  const handleGetFeeds = () => {
    dispatch(getFeedApi());
  };

  if (loading) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
