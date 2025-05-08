import {
  userReducer,
  initialState,
  setUser,
  setAuthChecked,
  loginUserThunk,
  registerUserThunk,
  logoutUserThunk,
  updateUserThunk
} from '../userSlice';
import { TUser } from '@utils-types';

describe('userReducer', () => {
  const mockUser: TUser = {
    email: 'test@test.com',
    name: 'Test User'
  };

  it('должен вернуть начальное состояние', () => {
    expect(userReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('reducers', () => {
    it('должен обработать setAuthChecked', () => {
      const action = setAuthChecked(true);
      const state = userReducer(initialState, action);

      expect(state.isAuthChecked).toBe(true);
    });

    it('должен обработать setUser', () => {
      const action = setUser(mockUser);
      const state = userReducer(initialState, action);

      expect(state.user).toEqual(mockUser);
    });
  });

  describe('extraReducers', () => {
    describe('loginUserThunk', () => {
      it('должен обработать loginUserThunk.pending', () => {
        const action = { type: loginUserThunk.pending.type };
        const state = userReducer(initialState, action);

        expect(state.loginUserRequest).toBe(true);
        expect(state.loginUserError).toBeNull();
      });

      it('должен обработать loginUserThunk.fulfilled', () => {
        const action = {
          type: loginUserThunk.fulfilled.type,
          payload: mockUser
        };
        const state = userReducer(initialState, action);

        expect(state.loginUserRequest).toBe(false);
        expect(state.user).toEqual(mockUser);
        expect(state.isAuthChecked).toBe(true);
      });

      it('должен обработать loginUserThunk.rejected', () => {
        const errorMessage = 'Login failed';
        const action = {
          type: loginUserThunk.rejected.type,
          error: { message: errorMessage }
        };
        const state = userReducer(initialState, action);

        expect(state.loginUserRequest).toBe(false);
        expect(state.loginUserError).toBe(errorMessage);
        expect(state.isAuthChecked).toBe(true);
      });
    });

    describe('registerUserThunk', () => {
      it('должен обработать registerUserThunk.pending', () => {
        const action = { type: registerUserThunk.pending.type };
        const state = userReducer(initialState, action);

        expect(state.registerUserRequest).toBe(true);
        expect(state.registerUserError).toBeNull();
      });

      it('должен обработать registerUserThunk.fulfilled', () => {
        const action = {
          type: registerUserThunk.fulfilled.type,
          payload: mockUser
        };
        const state = userReducer(initialState, action);

        expect(state.registerUserRequest).toBe(false);
        expect(state.user).toEqual(mockUser);
        expect(state.isAuthChecked).toBe(true);
      });

      it('должен обработать registerUserThunk.rejected', () => {
        const errorMessage = 'Registration failed';
        const action = {
          type: registerUserThunk.rejected.type,
          error: { message: errorMessage }
        };
        const state = userReducer(initialState, action);

        expect(state.registerUserRequest).toBe(false);
        expect(state.registerUserError).toBe(errorMessage);
        expect(state.isAuthChecked).toBe(true);
      });
    });

    describe('logoutUserThunk', () => {
      it('должен обработать logoutUserThunk.pending', () => {
        const action = { type: logoutUserThunk.pending.type };
        const state = userReducer(initialState, action);

        expect(state.logoutRequest).toBe(true);
        expect(state.logoutError).toBeNull();
      });

      it('должен обработать logoutUserThunk.fulfilled', () => {
        // Подготавливаем состояние с авторизованным пользователем
        const loggedInState = {
          ...initialState,
          user: mockUser
        };

        const action = { type: logoutUserThunk.fulfilled.type };
        const state = userReducer(loggedInState, action);

        expect(state.logoutRequest).toBe(false);
        expect(state.user).toBeNull();
      });

      it('должен обработать logoutUserThunk.rejected', () => {
        const errorMessage = 'Logout failed';
        const action = {
          type: logoutUserThunk.rejected.type,
          error: { message: errorMessage }
        };
        const state = userReducer(initialState, action);

        expect(state.logoutRequest).toBe(false);
        expect(state.logoutError).toBe(errorMessage);
      });
    });

    describe('updateUserThunk', () => {
      it('должен обработать updateUserThunk.pending', () => {
        const action = { type: updateUserThunk.pending.type };
        const state = userReducer(initialState, action);

        expect(state.updateUserRequest).toBe(true);
        expect(state.updateUserError).toBeNull();
      });

      it('должен обработать updateUserThunk.fulfilled', () => {
        const updatedUser = { ...mockUser, name: 'Updated Name' };
        const action = {
          type: updateUserThunk.fulfilled.type,
          payload: updatedUser
        };
        const state = userReducer(initialState, action);

        expect(state.updateUserRequest).toBe(false);
        expect(state.user).toEqual(updatedUser);
      });

      it('должен обработать updateUserThunk.rejected', () => {
        const errorMessage = 'Update user failed';
        const action = {
          type: updateUserThunk.rejected.type,
          error: { message: errorMessage }
        };
        const state = userReducer(initialState, action);

        expect(state.updateUserRequest).toBe(false);
        expect(state.updateUserError).toBe(errorMessage);
      });
    });
  });
});
