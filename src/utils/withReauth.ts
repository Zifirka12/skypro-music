import { refreshTokenAsync } from '@/store/features/authSlice';
import { AppDispatch } from '@/store/store';

/**
 * Утилита для автоматического обновления access токена при истечении срока действия
 * @param apiFunction - Функция API, которая принимает access токен
 * @param refresh - Refresh токен для обновления access токена
 * @param dispatch - Redux dispatch для обновления токенов в сторе
 * @returns Результат выполнения apiFunction
 */
export const withReauth = async <T>(
  apiFunction: (access: string) => Promise<T>,
  refresh: string,
  dispatch: AppDispatch,
): Promise<T> => {
  try {
    // Пытаемся выполнить запрос с пустым токеном (будет использован токен из замыкания)
    return await apiFunction('');
  } catch (error) {
    // Проверяем, является ли это ошибкой 401 (Unauthorized)
    const isUnauthorized =
      error instanceof Error &&
      (error.message.includes('401') || error.message.includes('Unauthorized'));

    // Если ошибка 401, обновляем токен и повторяем запрос
    if (isUnauthorized) {
      try {
        // Обновляем токен через Redux thunk
        const result = await dispatch(refreshTokenAsync({ refresh })).unwrap();

        // Повторяем исходный запрос с новым access токеном
        return await apiFunction(result.access);
      } catch (refreshError) {
        // Если обновление токена не удалось, пробрасываем ошибку
        throw refreshError;
      }
    }

    // Если ошибка не 401, пробрасываем её
    throw error;
  }
};
