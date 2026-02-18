import { addTrackToFavorite, removeTrackFromFavorite } from '@/api/tracksApi';
import { Track } from '@/types/track';
import { addLikedTrack, removeLikedTrack } from '@/store/features/trackSlice';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { withReauth } from '@/utils/withReauth';
import { useCallback, useMemo, useState } from 'react';

type ReturnTypeHook = {
  isLoading: boolean;
  errorMsg: string | null;
  toggleLike: () => void;
  isLike: boolean;
};

/**
 * Кастомный хук для управления лайками треков
 * @param track - Трек для управления лайками
 * @returns Объект с состоянием загрузки, ошибкой, функцией переключения лайка и статусом лайка
 */
export const useLikeTrack = (track: Track | null): ReturnTypeHook => {
  const { favoriteTracks } = useAppSelector((state) => state.tracks);
  const { accessToken, refreshToken } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  // Мемоизируем проверку лайка - вычисляется только при изменении favoriteTracks или track._id
  const isLike = useMemo(
    () => favoriteTracks.some((t) => t._id === track?._id),
    [favoriteTracks, track?._id],
  );

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Мемоизируем функцию toggleLike - пересоздается только при изменении зависимостей
  const toggleLike = useCallback(() => {
    if (!accessToken) {
      return setErrorMsg('Необходима авторизация для добавления в избранное');
    }

    if (!refreshToken) {
      return setErrorMsg('Отсутствует refresh токен');
    }

    if (!track) {
      return setErrorMsg('Трек не выбран');
    }

    setIsLoading(true);
    setErrorMsg(null);

    if (isLike) {
      withReauth(
        (newToken) =>
          removeTrackFromFavorite(newToken || accessToken, track._id),
        refreshToken,
        dispatch,
      )
        .then(() => {
          dispatch(removeLikedTrack(track));
        })
        .catch((error) => {
          if (error instanceof Error) {
            setErrorMsg(error.message);
          } else {
            setErrorMsg('Произошла неизвестная ошибка');
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      withReauth(
        (newToken) => addTrackToFavorite(newToken || accessToken, track._id),
        refreshToken,
        dispatch,
      )
        .then(() => {
          dispatch(addLikedTrack(track));
        })
        .catch((error) => {
          if (error instanceof Error) {
            setErrorMsg(error.message);
          } else {
            setErrorMsg('Произошла неизвестная ошибка');
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [accessToken, refreshToken, track, isLike, dispatch]);

  return {
    isLoading,
    errorMsg,
    toggleLike,
    isLike,
  };
};
