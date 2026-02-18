import { AppDispatch } from '@/store/store';
import { clearFavoriteTracks } from '@/store/features/trackSlice';
import { logout } from '@/store/features/authSlice';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

/**
 * Утилита для обработки выхода пользователя из системы
 * Очищает избранные треки, выходит из аккаунта и перенаправляет на главную страницу
 */
export const handleLogout = (
  dispatch: AppDispatch,
  router: AppRouterInstance,
): void => {
  dispatch(clearFavoriteTracks());
  dispatch(logout());
  router.push('/');
};
