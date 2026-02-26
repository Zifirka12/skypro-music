import { FilterState } from '@/types/filter';
import { Track } from '@/types/track';

/**
 * Фильтрует треки по поисковому запросу (по названию)
 */
export const filterBySearch = (
  tracks: Track[],
  searchQuery: string,
): Track[] => {
  if (!searchQuery.trim()) {
    return tracks;
  }

  const query = searchQuery.toLowerCase().trim();
  return tracks.filter((track) => track.name.toLowerCase().includes(query));
};

/**
 * Фильтрует треки по выбранным авторам
 */
export const filterByAuthors = (
  tracks: Track[],
  authors: string[],
): Track[] => {
  if (authors.length === 0) {
    return tracks;
  }

  return tracks.filter((track) => authors.includes(track.author));
};

/**
 * Фильтрует треки по выбранным жанрам
 */
export const filterByGenres = (tracks: Track[], genres: string[]): Track[] => {
  if (genres.length === 0) {
    return tracks;
  }

  return tracks.filter((track) =>
    track.genre.some((genre) => genres.includes(genre)),
  );
};

/**
 * Фильтрует треки по выбранным годам
 */
export const filterByYears = (tracks: Track[], years: string[]): Track[] => {
  if (years.length === 0) {
    return tracks;
  }

  return tracks.filter((track) => {
    const trackYear = track.release_date.split('-')[0];
    return years.includes(trackYear);
  });
};

/**
 * Сортирует треки по дате выпуска
 */
export const sortTracks = (
  tracks: Track[],
  sortOrder: FilterState['sortOrder'],
): Track[] => {
  if (sortOrder === 'default') {
    return tracks;
  }

  const sorted = [...tracks];
  sorted.sort((a, b) => {
    const dateA = new Date(a.release_date).getTime();
    const dateB = new Date(b.release_date).getTime();
    if (sortOrder === 'oldest') {
      return dateA - dateB;
    } else {
      return dateB - dateA;
    }
  });

  return sorted;
};

/**
 * Применяет все фильтры и сортировку к трекам
 */
export const filterAndSortTracks = (
  tracks: Track[],
  filterState: FilterState,
  searchQuery: string,
): Track[] => {
  let filtered = [...tracks];

  // Применяем фильтры последовательно
  filtered = filterBySearch(filtered, searchQuery);
  filtered = filterByAuthors(filtered, filterState.selectedAuthors);
  filtered = filterByGenres(filtered, filterState.selectedGenres);
  filtered = filterByYears(filtered, filterState.selectedYears);

  // Применяем сортировку
  filtered = sortTracks(filtered, filterState.sortOrder);

  return filtered;
};
