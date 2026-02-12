'use client';

import { fetchAllTracks } from '@/store/features/trackSlice';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { useEffect } from 'react';
import { Filter } from '../Filter/Filter';
import { Search } from '../Search/Search';
import { Track } from '../Track/Track';
import styles from './CenterBlock.module.css';

export const CenterBlock = () => {
  const dispatch = useAppDispatch();
  const { playlist, isLoading, error } = useAppSelector(
    (state) => state.tracks,
  );

  // Загружаем треки с сервера при монтировании компонента
  useEffect(() => {
    dispatch(fetchAllTracks());
  }, [dispatch]);

  // Проверяем, что playlist — это массив
  const tracks = Array.isArray(playlist) ? playlist : [];

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
