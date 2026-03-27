'use client';

import { getFavoriteTracks } from '@/api/tracksApi';
import styles from '@/components/CenterBlock/CenterBlock.module.css';
import { Filter } from '@/components/Filter/Filter';
import { MainLayout } from '@/components/MainLayout/MainLayout';
import { Search } from '@/components/Search/Search';
import { Track } from '@/components/Track/Track';
import { restoreAuth } from '@/store/features/authSlice';
import { setFavoriteTracks, setPlaylist } from '@/store/features/trackSlice';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { FilterState } from '@/types/filter';
import { Track as TrackType } from '@/types/track';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

export default function MyPlaylist() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { favoriteTracks } = useAppSelector((state) => state.tracks);
  const { isAuthenticated, accessToken } = useAppSelector(
    (state) => state.auth,
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [filterState, setFilterState] = useState<FilterState>({
    selectedAuthors: [],
    selectedGenres: [],
    selectedYears: [],
    sortOrder: 'default',
  });

  // Восстанавливаем авторизацию при монтировании
  useEffect(() => {
    dispatch(restoreAuth());
    setIsAuthChecked(true);
  }, [dispatch]);

  // Проверка авторизации - перенаправляем на главную, если не авторизован
  // Но только после того, как проверили авторизацию
  useEffect(() => {
    if (isAuthChecked && !isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, isAuthChecked, router]);

  // Загружаем избранные треки при монтировании страницы
  useEffect(() => {
    const loadFavoriteTracks = async () => {
      // Проверяем, что пользователь авторизован и есть токен
      if (!isAuthenticated || !accessToken || !isAuthChecked) {
        return;
      }

      // Проверяем базовый формат токена (JWT обычно имеет 3 части, разделенные точками)
      if (accessToken.split('.').length !== 3) {
        // Токен имеет неправильный формат, не делаем запрос
        return;
      }

      try {
        const tracks = await getFavoriteTracks(accessToken);
        dispatch(setFavoriteTracks(tracks));
        // Устанавливаем плейлист для корректной работы переключения треков
        dispatch(setPlaylist(tracks));
      } catch (error) {
        // Игнорируем ошибку 401 (неавторизован) - это нормально, если токен истек
        if (error instanceof Error && error.message.includes('401')) {
          // Токен недействителен, просто не загружаем избранные треки
          return;
        }
        // Ошибка загрузки избранных треков обработана
      }
    };

    // Загружаем треки только после проверки авторизации
    if (isAuthChecked && isAuthenticated) {
      loadFavoriteTracks();
    }
  }, [isAuthenticated, accessToken, dispatch, isAuthChecked]);

  // Обновляем плейлист при изменении избранных треков
  // Это нужно для корректной работы переключения треков и shuffle
  useEffect(() => {
    if (favoriteTracks.length > 0) {
      dispatch(setPlaylist(favoriteTracks));
    }
  }, [favoriteTracks, dispatch]);

  // Обработчик изменения фильтров
  const handleFilterChange = useCallback((filters: FilterState) => {
    setFilterState(filters);
  }, []);

  // Комбинированная фильтрация: поиск + фильтры + сортировка
  const filteredAndSortedTracks = useMemo(() => {
    let filtered = [...favoriteTracks];

    // Фильтрация по поисковому запросу (частичное совпадение, регистронезависимое)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((track: TrackType) =>
        track.name.toLowerCase().includes(query),
      );
    }

    // Фильтрация по исполнителям
    if (filterState.selectedAuthors.length > 0) {
      filtered = filtered.filter((track: TrackType) =>
        filterState.selectedAuthors.includes(track.author),
      );
    }

    // Фильтрация по жанрам
    if (filterState.selectedGenres.length > 0) {
      filtered = filtered.filter((track: TrackType) =>
        track.genre.some((genre) => filterState.selectedGenres.includes(genre)),
      );
    }

    // Фильтрация по годам
    if (filterState.selectedYears.length > 0) {
      filtered = filtered.filter((track: TrackType) => {
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
  }, [favoriteTracks, filterState, searchQuery]);

  // Если еще не проверили авторизацию или не авторизован, не показываем контент
  if (!isAuthChecked || !isAuthenticated) {
    return (
      <MainLayout>
        <div className={styles.centerblock}>
          <div className={styles.centerblock__loading}>Загрузка...</div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className={styles.centerblock}>
        <Search value={searchQuery} onChange={setSearchQuery} />
        <Filter tracks={favoriteTracks} onFilterChange={handleFilterChange} />
        <h2 className={styles.centerblock__h2}>Мои треки</h2>

        {favoriteTracks.length === 0 ? (
          <div className={styles.centerblock__empty}>
            <p>У вас пока нет избранных треков</p>
            <p
              style={{ marginTop: '10px', color: '#696969', fontSize: '14px' }}
            >
              Добавьте треки в избранное, нажав на иконку сердечка
            </p>
          </div>
        ) : (
          <div className={styles.centerblock__content}>
            <div className={styles.content__playlist}>
              <Track isHeader={true} />
              {filteredAndSortedTracks.length > 0 ? (
                filteredAndSortedTracks.map((track) => (
                  <Track key={track._id} track={track} />
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
    </MainLayout>
  );
}
