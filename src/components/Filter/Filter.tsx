'use client';

import { data } from '@/app/data';
import { useMemo, useState } from 'react';
import { FilterItem } from '../FilterItem/FilterItem';
import styles from './Filter.module.css';

export const Filter = () => {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const uniqueAuthors = useMemo(() => {
    const authors = [...new Set(data.map((track) => track.author))].filter(
      (author) => author !== '-',
    );
    return authors.sort();
  }, []);

  const uniqueYears = useMemo(() => {
    const years = [
      ...new Set(data.map((track) => track.release_date.split('-')[0])),
    ].sort((a, b) => b.localeCompare(a));
    return years;
  }, []);

  const uniqueGenres = useMemo(() => {
    const genres = [...new Set(data.flatMap((track) => track.genre))].sort();
    return genres;
  }, []);

  const handleFilterClick = (filterType: string) => {
    setActiveFilter(activeFilter === filterType ? null : filterType);
  };

  const renderFilterList = () => {
    if (!activeFilter) {
      return null;
    }

    let items: string[] = [];

    switch (activeFilter) {
      case 'author':
        items = uniqueAuthors;
        break;
      case 'year':
        items = uniqueYears;
        break;
      case 'genre':
        items = uniqueGenres;
        break;
      default:
        return null;
    }

    return (
      <div className={styles.filter__list}>
        {items.map((item, index) => (
          <div key={index} className={styles.filter__item}>
            {item}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={styles.centerblock__filter}>
      <div className={styles.filter__title}>Искать по:</div>
      <div className={styles.filter__buttons}>
        <FilterItem
          label="исполнителю"
          filterType="author"
          isActive={activeFilter === 'author'}
          onFilterClick={handleFilterClick}
        >
          {activeFilter === 'author' && renderFilterList()}
        </FilterItem>
        <FilterItem
          label="году выпуска"
          filterType="year"
          isActive={activeFilter === 'year'}
          onFilterClick={handleFilterClick}
        >
          {activeFilter === 'year' && renderFilterList()}
        </FilterItem>
        <FilterItem
          label="жанру"
          filterType="genre"
          isActive={activeFilter === 'genre'}
          onFilterClick={handleFilterClick}
        >
          {activeFilter === 'genre' && renderFilterList()}
        </FilterItem>
      </div>
    </div>
  );
};
