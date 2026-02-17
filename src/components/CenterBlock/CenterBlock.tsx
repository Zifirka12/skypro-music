'use client';

import { fetchAllTracks, setFavoriteTracks } from '@/store/features/trackSlice';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { getFavoriteTracks } from '@/api/tracksApi';
import { useEffect, useMemo } from 'react';
import { Filter } from '../Filter/Filter';
import { Search } from '../Search/Search';
import { Track } from '../Track/Track';
import styles from './CenterBlock.module.css';

export const CenterBlock = () => {
  const dispatch = useAppDispatch();
  const { playlist, isLoading, error, favoriteTracks } = useAppSelector(
    (state) => state.tracks,
  );
  const { accessToken, isAuthenticated } = useAppSelector(
    (state) => state.auth,
  );

  // Загружаем треки с сервера при монтировании компонента
  useEffect(() => {
    dispatch(fetchAllTracks());
  }, [dispatch]);

  // Загружаем избранные треки только если они еще не загружены
  useEffect(() => {
    const loadFavoriteTracks = async () => {
      if (isAuthenticated && accessToken && favoriteTracks.length === 0) {
        try {
          const tracks = await getFavoriteTracks(accessToken);
          dispatch(setFavoriteTracks(tracks));
        } catch (error) {
          console.error('Ошибка загрузки избранных треков:', error);
        }
      }
    };

    loadFavoriteTracks();
  }, [isAuthenticated, accessToken, dispatch, favoriteTracks.length]);

  // Мемоизируем проверку и преобразование playlist в массив
  const tracks = useMemo(
    () => (Array.isArray(playlist) ? playlist : []),
    [playlist],
  );

  return (
    <div className={styles.centerblock}>
      <Search />
      <Filter />
      <h2 className={styles.centerblock__h2}>Треки</h2>

      {isLoading && (
        <div className={styles.centerblock__loading}>Загрузка треков...</div>
      )}

      {error && (
        <div className={styles.centerblock__error}>
          Ошибка загрузки: {error}
        </div>
      )}

      {!isLoading && !error && (
        <div className={styles.centerblock__content}>
          <div className={styles.content__playlist}>
            <Track isHeader={true} />
            {tracks.map((track) => (
              <Track key={track._id} track={track} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
