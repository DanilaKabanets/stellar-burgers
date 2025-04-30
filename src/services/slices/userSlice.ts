import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import {
  registerUserApi,
  loginUserApi,
  logoutApi,
  getUserApi,
  updateUserApi,
  TRegisterData,
  TLoginData
} from '../../utils/burger-api';
import { setCookie, deleteCookie } from '../../utils/cookie';

interface UserState {
  isAuthChecked: boolean;
  user: TUser | null;

  registerUserRequest: boolean;
  registerUserError: string | null;

  loginUserRequest: boolean;
  loginUserError: string | null;

  getUserRequest: boolean;
  getUserError: string | null;

  updateUserRequest: boolean;
  updateUserError: string | null;

  logoutRequest: boolean;
  logoutError: string | null;
}

export const initialState: UserState = {
  isAuthChecked: false, // Статус проверки токена пользователя
  user: null,

  registerUserRequest: false,
  registerUserError: null,

  loginUserRequest: false,
  loginUserError: null,

  getUserRequest: false,
  getUserError: null,

  updateUserRequest: false,
  updateUserError: null,

  logoutRequest: false,
  logoutError: null
};

// Thunk для регистрации
export const registerUserThunk = createAsyncThunk(
  'user/register',
  async (userData: TRegisterData) => {
    const data = await registerUserApi(userData);
    if (data?.success) {
      setCookie('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
    }
    return data.user;
  }
);

// Thunk для логина
export const loginUserThunk = createAsyncThunk(
  'user/login',
  async (userData: TLoginData) => {
    const data = await loginUserApi(userData);
    if (data?.success) {
      setCookie('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
    }
    return data.user;
  }
);

// Thunk для выхода
export const logoutUserThunk = createAsyncThunk('user/logout', async () => {
  await logoutApi();
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
});

// Thunk для проверки авторизации пользователя
export const checkUserAuthThunk = createAsyncThunk(
  'user/checkAuth',
  async (_, { dispatch }) => {
    try {
      const data = await getUserApi();
      if (data?.success) {
        dispatch(setUser(data.user));
      }
    } catch (error) {
      console.error('Check auth failed:', error);
    } finally {
      dispatch(setAuthChecked(true)); // Устанавливаем флаг, что проверка выполнена
    }
  }
);

// Thunk для обновления данных пользователя
export const updateUserThunk = createAsyncThunk(
  'user/update',
  async (userData: Partial<TRegisterData>) => {
    const data = await updateUserApi(userData);
    return data.user;
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setAuthChecked: (state, action: PayloadAction<boolean>) => {
      state.isAuthChecked = action.payload;
    },
    setUser: (state, action: PayloadAction<TUser | null>) => {
      state.user = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUserThunk.pending, (state) => {
        state.registerUserRequest = true;
        state.registerUserError = null;
      })
      .addCase(registerUserThunk.fulfilled, (state, action) => {
        state.registerUserRequest = false;
        state.user = action.payload;
        state.isAuthChecked = true; // Пользователь аутентифицирован
      })
      .addCase(registerUserThunk.rejected, (state, action) => {
        state.registerUserRequest = false;
        state.registerUserError = action.error.message || 'Registration failed';
        state.isAuthChecked = true; // Проверка завершена, но неудачно
      })
      // Login
      .addCase(loginUserThunk.pending, (state) => {
        state.loginUserRequest = true;
        state.loginUserError = null;
      })
      .addCase(loginUserThunk.fulfilled, (state, action) => {
        state.loginUserRequest = false;
        state.user = action.payload;
        state.isAuthChecked = true; // Пользователь аутентифицирован
      })
      .addCase(loginUserThunk.rejected, (state, action) => {
        state.loginUserRequest = false;
        state.loginUserError = action.error.message || 'Login failed';
        state.isAuthChecked = true; // Проверка завершена, но неудачно
      })
      // Logout
      .addCase(logoutUserThunk.pending, (state) => {
        state.logoutRequest = true;
        state.logoutError = null;
      })
      .addCase(logoutUserThunk.fulfilled, (state) => {
        state.logoutRequest = false;
        state.user = null;
      })
      .addCase(logoutUserThunk.rejected, (state, action) => {
        state.logoutRequest = false;
        state.logoutError = action.error.message || 'Logout failed';
      })
      // Get User (используется в checkUserAuthThunk)
      .addCase(checkUserAuthThunk.pending, (state) => {
        state.getUserRequest = true;
        state.getUserError = null;
      })
      .addCase(checkUserAuthThunk.fulfilled, (state) => {
        state.getUserRequest = false;
        // setUser вызывается внутри thunk
      })
      .addCase(checkUserAuthThunk.rejected, (state, action) => {
        state.getUserRequest = false;
        state.getUserError = action.error.message || 'Get user failed';
        state.user = null; // Если не удалось получить пользователя, сбрасываем его
      })
      // Update User
      .addCase(updateUserThunk.pending, (state) => {
        state.updateUserRequest = true;
        state.updateUserError = null;
      })
      .addCase(updateUserThunk.fulfilled, (state, action) => {
        state.updateUserRequest = false;
        state.user = action.payload;
      })
      .addCase(updateUserThunk.rejected, (state, action) => {
        state.updateUserRequest = false;
        state.updateUserError = action.error.message || 'Update user failed';
      });
  }
});

export const { setAuthChecked, setUser } = userSlice.actions;
export const userReducer = userSlice.reducer;

// Селекторы
export const selectIsAuthChecked = (state: { user: UserState }) =>
  state.user.isAuthChecked;
export const selectUser = (state: { user: UserState }) => state.user.user;
export const selectUserName = (state: { user: UserState }) =>
  state.user.user?.name;
export const selectAuthError = (state: { user: UserState }) =>
  state.user.loginUserError || state.user.registerUserError;
export const selectGetUserRequest = (state: { user: UserState }) =>
  state.user.getUserRequest;
