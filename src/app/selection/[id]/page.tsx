'use client';

import { getSelectionById } from '@/api/selectionsApi';
import { getAllTracks, getFavoriteTracks } from '@/api/tracksApi';
import styles from '@/components/CenterBlock/CenterBlock.module.css';
import { MainLayout } from '@/components/MainLayout/MainLayout';
import { Search } from '@/components/Search/Search';
import { Track } from '@/components/Track/Track';
import { setFavoriteTracks, setPlaylist } from '@/store/features/trackSlice';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { Selection } from '@/types/selection';
import { Track as TrackType } from '@/types/track';
import { use, useEffect, useMemo, useRef, useState } from 'react';

type SelectionParams = Promise<{ id: string }>;

export default function SelectionPage({ params }: { params: SelectionParams }) {
  const resolvedParams = use(params);
  const selectionKey = resolvedParams.id;
  const selectionId = Number(selectionKey);
  const dispatch = useAppDispatch();
  const { accessToken, isAuthenticated } = useAppSelector(
    (state) => state.auth,
  );
  const { favoriteTracks } = useAppSelector((state) => state.tracks);
  const hasLoadedFavorites = useRef(false);
  const [selection, setSelection] = useState<Selection | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const currentFetchId = useRef<string | null>(null);

  // Кастомные названия для отображения (соответствуют картинкам)
  const customTitles: Record<number, string> = {
    2: 'Плейлист дня',
    3: '100 танцевальных хитов',
    4: 'Инди-заряд',
  };

  useEffect(() => {
    let isActive = true;

    const loadSelection = async () => {
      if (currentFetchId.current === selectionKey) {
        return;
      }

      currentFetchId.current = selectionKey;

      try {
        setIsLoading(true);
        setError(null);

        const [selectionData, allTracksData] = await Promise.all([
          getSelectionById(selectionId),
          getAllTracks(),
        ]);

        if (!selectionData) {
          throw new Error('Подборка не найдена');
        }

        const selectionTracks = allTracksData.filter((track) =>
          selectionData.items.includes(track._id),
        );

        const fullSelection: Selection = {
          ...selectionData,
          items: selectionTracks,
        };

        if (isActive) {
          setSelection(fullSelection);
          dispatch(setPlaylist(selectionTracks));
        }
      } catch (loadError) {
        if (isActive) {
          setError((loadError as Error).message);
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
        if (currentFetchId.current === selectionKey) {
          currentFetchId.current = null;
        }
      }
    };

    loadSelection();

    return () => {
      isActive = false;
      if (currentFetchId.current === selectionKey) {
        currentFetchId.current = null;
      }
    };
  }, [selectionKey, dispatch, selectionId]);

  useEffect(() => {
    const loadFavoriteTracks = async () => {
      if (
        isAuthenticated &&
        accessToken &&
        !hasLoadedFavorites.current &&
        favoriteTracks.length === 0
      ) {
        hasLoadedFavorites.current = true;
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

  // Фильтрация треков по поисковому запросу
  const filteredTracks = useMemo(() => {
    if (!selection?.items) {
      return [];
    }

    if (!searchQuery.trim()) {
      return selection.items;
    }

    const query = searchQuery.toLowerCase().trim();
    return selection.items.filter((track: TrackType) =>
      track.name.toLowerCase().includes(query),
    );
  }, [selection?.items, searchQuery]);

  return (
    <MainLayout>
      <div className={styles.centerblock}>
        <Search value={searchQuery} onChange={setSearchQuery} />
        <h2 className={styles.centerblock__h2}>
          {customTitles[selectionId] || selection?.name || 'Подборка'}
        </h2>

        {isLoading && (
          <div className={styles.centerblock__loading}>
            Загрузка подборки...
          </div>
        )}

        {error && (
          <div className={styles.centerblock__error}>Ошибка: {error}</div>
        )}

        {!isLoading && !error && selection && (
          <div className={styles.centerblock__content}>
            <div className={styles.content__playlist}>
              <Track isHeader={true} />
              {filteredTracks.length > 0 ? (
                filteredTracks.map((track) => (
                  <Track key={track._id} track={track} />
                ))
              ) : (
                <div className={styles.centerblock__empty}>
                  Треки не найдены. Попробуйте изменить поисковый запрос.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
