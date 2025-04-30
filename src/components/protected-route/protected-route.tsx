import { Navigate, useLocation } from 'react-router-dom';
import {
  selectIsAuthChecked,
  selectUser
} from '../../services/slices/userSlice';
import { useAppSelector } from '../../services/store';
import { Preloader } from '../ui/preloader';
import { FC, ReactNode } from 'react';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: ReactNode;
};

export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  onlyUnAuth = false,
  children
}) => {
  const isAuthChecked = useAppSelector(selectIsAuthChecked);
  const user = useAppSelector(selectUser);
  const location = useLocation();

  if (!isAuthChecked) {
    // Пока идет проверка авторизации, показываем прелоадер
    return <Preloader />;
  }

  if (onlyUnAuth && user) {
    // Если разрешен только неавторизованный доступ, а пользователь авторизован,
    // редиректим на главную страницу или на предыдущую страницу
    const { from } = location.state || { from: { pathname: '/' } };
    return <Navigate to={from} replace />;
  }

  if (!onlyUnAuth && !user) {
    // Если требуется авторизация, а пользователь не авторизован,
    // редиректим на страницу логина, сохраняя предыдущий путь
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  // Если все проверки пройдены, рендерим дочерний компонент
  return <>{children}</>;
};
