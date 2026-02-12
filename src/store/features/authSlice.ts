import { getTokens, login, refreshToken, signUp } from '@/api/authApi';
import {
  LoginRequest,
  RefreshTokenRequest,
  SignUpRequest,
  TokenRequest,
  User,
} from '@/types/auth';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

// Ключи для localStorage
const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_KEY = 'user';

// Вспомогательные функции для работы с localStorage
const getStoredAccessToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

const getStoredRefreshToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

const getStoredUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem(USER_KEY);
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

const saveTokens = (access: string, refresh: string) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ACCESS_TOKEN_KEY, access);
  localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
};

const saveUser = (user: User) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

const clearStorage = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Восстанавливаем состояние из localStorage при инициализации
const initialState: AuthState = {
  user: null, // Изначально null, восстановим после гидратации
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Асинхронные thunks
export const signUpAsync = createAsyncThunk(
  'auth/signUp',
  async (data: SignUpRequest, { rejectWithValue }) => {
    try {
      const response = await signUp(data);
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  },
);

export const loginAsync = createAsyncThunk(
  'auth/login',
  async (data: LoginRequest, { rejectWithValue }) => {
    try {
      const response = await login(data);
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  },
);

export const getTokensAsync = createAsyncThunk(
  'auth/getTokens',
  async (data: TokenRequest, { rejectWithValue }) => {
    try {
      const response = await getTokens(data);
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  },
);

export const refreshTokenAsync = createAsyncThunk(
  'auth/refreshToken',
  async (data: RefreshTokenRequest, { rejectWithValue }) => {
    try {
      const response = await refreshToken(data);
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    restoreAuth: (state) => {
      if (typeof window !== 'undefined') {
        const storedUser = getStoredUser();
        const storedAccessToken = getStoredAccessToken();
        const storedRefreshToken = getStoredRefreshToken();

        if (storedAccessToken && storedRefreshToken) {
          state.user = storedUser;
          state.accessToken = storedAccessToken;
          state.refreshToken = storedRefreshToken;
          state.isAuthenticated = true;
        }
      }
    },
    setTokens: (
      state,
      action: PayloadAction<{ access: string; refresh: string }>,
    ) => {
      state.accessToken = action.payload.access;
      state.refreshToken = action.payload.refresh;
      state.isAuthenticated = true;
      saveTokens(action.payload.access, action.payload.refresh);
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      saveUser(action.payload);
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;
      clearStorage();
    },
    clearError: (state) => {
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Sign Up
    builder
      .addCase(signUpAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signUpAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.result;
        saveUser(action.payload.result);
        state.error = null;
      })
      .addCase(signUpAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || 'Ошибка при регистрации';
      });

    // Login
    builder
      .addCase(loginAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        saveUser(action.payload);
        state.error = null;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || 'Ошибка при входе';
      });

    // Get Tokens
    builder
      .addCase(getTokensAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getTokensAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.accessToken = action.payload.access;
        state.refreshToken = action.payload.refresh;
        state.isAuthenticated = true;
        saveTokens(action.payload.access, action.payload.refresh);
        state.error = null;
      })
      .addCase(getTokensAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) || 'Ошибка при получении токенов';
      });

    // Refresh Token
    builder
      .addCase(refreshTokenAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(refreshTokenAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.accessToken = action.payload.access;
        if (state.refreshToken) {
          saveTokens(action.payload.access, state.refreshToken);
        }
        state.error = null;
      })
      .addCase(refreshTokenAsync.rejected, (state, action) => {
        state.isLoading = false;
        const errorMessage =
          (action.payload as string) || 'Ошибка при обновлении токена';
        state.error = errorMessage;
        // Если refresh токен невалиден, разлогиниваем пользователя
        if (
          errorMessage.includes('недействителен') ||
          errorMessage.includes('просрочен')
        ) {
          state.user = null;
          state.accessToken = null;
          state.refreshToken = null;
          state.isAuthenticated = false;
          clearStorage();
        }
      });
  },
});

export const {
  restoreAuth,
  setTokens,
  setUser,
  logout,
  clearError,
  setLoading,
} = authSlice.actions;
export const authSliceReducer = authSlice.reducer;
