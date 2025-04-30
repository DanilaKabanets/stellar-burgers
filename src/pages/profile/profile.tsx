import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../services/store';
import { selectUser, updateUserThunk } from '../../services/slices/userSlice';
import { TRegisterData } from '../../utils/burger-api';

export const Profile: FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  const [formValue, setFormValue] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: ''
  });

  useEffect(() => {
    if (user) {
      setFormValue((prevState) => ({
        ...prevState,
        name: user.name,
        email: user.email
      }));
    }
  }, [user]);

  const isFormChanged = useMemo(
    () =>
      formValue.name !== (user?.name || '') ||
      formValue.email !== (user?.email || '') ||
      formValue.password !== '',
    [formValue, user?.name, user?.email]
  );

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (!isFormChanged) return;

    const updateData: Partial<TRegisterData> = {};
    if (formValue.name !== (user?.name || '')) {
      updateData.name = formValue.name;
    }
    if (formValue.email !== (user?.email || '')) {
      updateData.email = formValue.email;
    }
    if (formValue.password) {
      updateData.password = formValue.password;
    }

    dispatch(updateUserThunk(updateData))
      .unwrap()
      .then(() => {
        setFormValue((prev) => ({ ...prev, password: '' }));
      })
      .catch((error) => {
        console.error('Ошибка обновления профиля:', error);
      });
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormValue({
      name: user?.name || '',
      email: user?.email || '',
      password: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
