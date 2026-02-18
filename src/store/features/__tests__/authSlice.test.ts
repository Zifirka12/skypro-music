import { describe, expect, it } from 'vitest';

import { authSliceReducer, logout, setTokens, setUser } from '../authSlice';
import { User } from '@/types/auth';

describe('authSlice reducer', () => {
  const mockUser: User = {
    _id: 1,
    email: 'user@example.com',
    username: 'User',
  };

  it('saves tokens and marks user as authenticated', () => {
    const initialState = authSliceReducer(undefined, { type: 'init' });
    const updatedState = authSliceReducer(
      initialState,
      setTokens({ access: 'access-token', refresh: 'refresh-token' }),
    );

    expect(updatedState.accessToken).toBe('access-token');
    expect(updatedState.refreshToken).toBe('refresh-token');
    expect(updatedState.isAuthenticated).toBe(true);
  });

  it('stores user info and clears it on logout', () => {
    let state = authSliceReducer(undefined, { type: 'init' });
    state = authSliceReducer(state, setUser(mockUser));
    state = authSliceReducer(state, logout());

    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.accessToken).toBeNull();
  });
});
