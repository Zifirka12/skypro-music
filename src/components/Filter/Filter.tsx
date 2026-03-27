'use client';

import { FilterState, SortOrder } from '@/types/filter';
import { Track } from '@/types/track';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FilterItem } from '../FilterItem/FilterItem';
import styles from './Filter.module.css';

interface FilterProps {
  tracks: Track[];
  onFilterChange: (filters: FilterState) => void;
}

export const Filter = ({ tracks, onFilterChange }: FilterProps) => {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<SortOrder>('default');
  const filterRef = useRef<HTMLDivElement>(null);

  // Закрываем выпадающее меню при клике вне его
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setActiveFilter(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Уникальные значения из треков
  const uniqueAuthors = useMemo(() => {
    if (!Array.isArray(tracks) || tracks.length === 0) {
      return [];
    }
    const authors = [...new Set(tracks.map((track) => track.author))].filter(
      (author) => author && author !== '-',
    );
    return authors.sort();
  }, [tracks]);

  const uniqueYears = useMemo(() => {
    if (!Array.isArray(tracks) || tracks.length === 0) {
      return [];
    }
    const years = [
      ...new Set(tracks.map((track) => track.release_date.split('-')[0])),
    ].sort((a, b) => b.localeCompare(a));
    return years;
  }, [tracks]);

  const uniqueGenres = useMemo(() => {
    if (!Array.isArray(tracks) || tracks.length === 0) {
      return [];
    }
    const genres = [...new Set(tracks.flatMap((track) => track.genre))].sort();
    return genres;
  }, [tracks]);

  // Обработчик клика по фильтру
  const handleFilterClick = useCallback(
    (filterType: string) => {
      setActiveFilter(activeFilter === filterType ? null : filterType);
    },
    [activeFilter],
  );

  // Обработчик выбора элемента фильтра
  const handleItemToggle = useCallback((filterType: string, item: string) => {
    if (filterType === 'author') {
      setSelectedAuthors((prev) =>
        prev.includes(item) ? prev.filter((a) => a !== item) : [...prev, item],
      );
    } else if (filterType === 'genre') {
      setSelectedGenres((prev) =>
        prev.includes(item) ? prev.filter((g) => g !== item) : [...prev, item],
      );
    } else if (filterType === 'year') {
      setSelectedYears((prev) =>
        prev.includes(item) ? prev.filter((y) => y !== item) : [...prev, item],
      );
    }
  }, []);

  // Отправляем изменения фильтров в родительский компонент
  useEffect(() => {
    onFilterChange({
      selectedAuthors,
      selectedGenres,
      selectedYears,
      sortOrder,
    });
  }, [
    selectedAuthors,
    selectedGenres,
    selectedYears,
    sortOrder,
    onFilterChange,
  ]);

  // Рендер списка фильтров
  const renderFilterList = useMemo(() => {
    if (!activeFilter) {
      return null;
    }

    let items: string[] = [];
    let selectedItems: string[] = [];

    switch (activeFilter) {
      case 'author':
        items = uniqueAuthors;
        selectedItems = selectedAuthors;
        break;
      case 'year':
        items = uniqueYears;
        selectedItems = selectedYears;
        break;
      case 'genre':
        items = uniqueGenres;
        selectedItems = selectedGenres;
        break;
      default:
        return null;
    }

    return (
      <div className={styles.filter__list}>
        {items.map((filterItem, itemIndex) => {
          const isSelected = selectedItems.includes(filterItem);
          return (
            <div
              key={itemIndex}
              className={`${styles.filter__item} ${
                isSelected ? styles.filter__itemActive : ''
              }`}
              onClick={() => handleItemToggle(activeFilter, filterItem)}
            >
              {filterItem}
            </div>
          );
        })}
      </div>
    );
  }, [
    activeFilter,
    uniqueAuthors,
    uniqueYears,
    uniqueGenres,
    selectedAuthors,
    selectedGenres,
    selectedYears,
    handleItemToggle,
  ]);

  // Получаем количество выбранных фильтров
  const getFilterCount = (filterType: string): number => {
    switch (filterType) {
      case 'author':
        return selectedAuthors.length;
      case 'genre':
        return selectedGenres.length;
      case 'year':
        return selectedYears.length;
      default:
        return 0;
    }
  };

  return (
    <div className={styles.centerblock__filter} ref={filterRef}>
      <div className={styles.filter__title}>Искать по:</div>
      <div className={styles.filter__buttons}>
        <FilterItem
          label="исполнителю"
          filterType="author"
          isActive={activeFilter === 'author'}
          count={getFilterCount('author')}
          onFilterClick={handleFilterClick}
        >
          {activeFilter === 'author' && renderFilterList}
        </FilterItem>
        <FilterItem
          label="году выпуска"
          filterType="year"
          isActive={activeFilter === 'year'}
          count={getFilterCount('year')}
          onFilterClick={handleFilterClick}
        >
          {activeFilter === 'year' && renderFilterList}
        </FilterItem>
        <FilterItem
          label="жанру"
          filterType="genre"
          isActive={activeFilter === 'genre'}
          count={getFilterCount('genre')}
          onFilterClick={handleFilterClick}
        >
          {activeFilter === 'genre' && renderFilterList}
        </FilterItem>
      </div>
    </div>
  );
};
