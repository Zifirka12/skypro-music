'use client';

import { getFavoriteTracks } from '@/api/tracksApi';
import { fetchAllTracks, setFavoriteTracks } from '@/store/features/trackSlice';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { FilterState } from '@/types/filter';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Filter } from '../Filter/Filter';
import { Search } from '../Search/Search';
import { Track as TrackComponent } from '../Track/Track';
import styles from './CenterBlock.module.css';

export const CenterBlock = () => {
  const dispatch = useAppDispatch();
  const { playlist, isLoading, error, favoriteTracks } = useAppSelector(
    (state) => state.tracks,
  );
  const { accessToken, isAuthenticated } = useAppSelector(
    (state) => state.auth,
  );
  const [filterState, setFilterState] = useState<FilterState>({
    selectedAuthors: [],
    selectedGenres: [],
    selectedYears: [],
    sortOrder: 'default',
  });
  const [searchQuery, setSearchQuery] = useState('');

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
          // Ошибка загрузки избранных треков обработана
        }
      }
    };

    loadFavoriteTracks();
  }, [isAuthenticated, accessToken, dispatch, favoriteTracks.length]);

  // Обработчик изменения фильтров
  const handleFilterChange = useCallback((filters: FilterState) => {
    setFilterState(filters);
  }, []);

  // Мемоизируем проверку и преобразование playlist в массив
  const allTracks = useMemo(
    () => (Array.isArray(playlist) ? playlist : []),
    [playlist],
  );

  // Применяем фильтры, поиск и сортировку
  const filteredAndSortedTracks = useMemo(() => {
    let filtered = [...allTracks];

    // Фильтрация по поисковому запросу (частичное совпадение, регистронезависимое)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((track) =>
        track.name.toLowerCase().includes(query),
      );
    }

    // Фильтрация по исполнителям
    if (filterState.selectedAuthors.length > 0) {
      filtered = filtered.filter((track) =>
        filterState.selectedAuthors.includes(track.author),
      );
    }

    // Фильтрация по жанрам
    if (filterState.selectedGenres.length > 0) {
      filtered = filtered.filter((track) =>
        track.genre.some((genre) => filterState.selectedGenres.includes(genre)),
      );
    }

    // Фильтрация по годам
    if (filterState.selectedYears.length > 0) {
      filtered = filtered.filter((track) => {
        const trackYear = track.release_date.split('-')[0];
        return filterState.selectedYears.includes(trackYear);
      });
    }

    // Сортировка
    if (filterState.sortOrder !== 'default') {
      filtered.sort((a, b) => {
        const dateA = new Date(a.release_date).getTime();
        const dateB = new Date(b.release_date).getTime();
        if (filterState.sortOrder === 'oldest') {
          return dateA - dateB;
        } else {
          return dateB - dateA;
        }
      });
    }

    return filtered;
  }, [allTracks, filterState, searchQuery]);

  return (
    <div className={styles.centerblock}>
      <Search value={searchQuery} onChange={setSearchQuery} />
      <Filter tracks={allTracks} onFilterChange={handleFilterChange} />
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
            <TrackComponent isHeader={true} />
            {filteredAndSortedTracks.length > 0 ? (
              filteredAndSortedTracks.map((track) => (
                <TrackComponent key={track._id} track={track} />
              ))
            ) : (
              <div className={styles.centerblock__empty}>
                Нет подходящих треков
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
