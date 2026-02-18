import {
  ApiError,
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  SignUpRequest,
  SignUpResponse,
  TokenRequest,
  TokenResponse,
} from '@/types/auth';

const API_BASE_URL = 'https://webdev-music-003b5b991590.herokuapp.com';

// Вспомогательная функция для обработки ответов API
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = `Ошибка: ${response.status}`;

    try {
      const errorData: ApiError = await response.json();

      // Извлекаем сообщение об ошибке из разных возможных полей
      if (errorData.message) {
        errorMessage = errorData.message;
      } else if (errorData.detail) {
        errorMessage = errorData.detail;
      } else if (typeof errorData === 'string') {
        errorMessage = errorData;
      } else if (errorData.code) {
        // Для токенов может быть поле code
        errorMessage =
          errorData.code === 'token_not_valid'
            ? 'Токен недействителен или просрочен'
            : errorData.code;
      }
    } catch (parseError) {
      // Если не удалось распарсить JSON, используем стандартные сообщения
      switch (response.status) {
        case 400:
          errorMessage = 'Некорректный запрос. Проверьте введенные данные';
          break;
        case 401:
          errorMessage = 'Неверный email или пароль';
          break;
        case 403:
          errorMessage = 'Доступ запрещен';
          break;
        case 500:
          errorMessage = 'Ошибка сервера. Попробуйте позже';
          break;
        default:
          errorMessage = `Ошибка: ${response.status} ${response.statusText}`;
      }
    }

    throw new Error(errorMessage);
  }
  return response.json();
}

// Регистрация пользователя
export async function signUp(
  signUpData: SignUpRequest,
): Promise<SignUpResponse> {
  const response = await fetch(`${API_BASE_URL}/user/signup/`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(signUpData),
  });

  return handleResponse<SignUpResponse>(response);
}

// Вход в систему
export async function login(loginData: LoginRequest): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/user/login/`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(loginData),
  });

  return handleResponse<LoginResponse>(response);
}

// Получение токенов (access и refresh)
export async function getTokens(
  tokenData: TokenRequest,
): Promise<TokenResponse> {
  const response = await fetch(`${API_BASE_URL}/user/token/`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(tokenData),
  });

  return handleResponse<TokenResponse>(response);
}

// Обновление access токена
export async function refreshToken(
  refreshTokenData: RefreshTokenRequest,
): Promise<RefreshTokenResponse> {
  const response = await fetch(`${API_BASE_URL}/user/token/refresh/`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(refreshTokenData),
  });

  return handleResponse<RefreshTokenResponse>(response);
}
