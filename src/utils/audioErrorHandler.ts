import { setIsPlaying } from '@/store/features/trackSlice';
import { AppDispatch } from '@/store/store';

/**
 * Обработчик ошибок воспроизведения аудио
 * Останавливает воспроизведение при ошибке
 */
export const handleAudioPlayError = (
  error: unknown,
  dispatch: AppDispatch,
): void => {
  dispatch(setIsPlaying(false));
};
