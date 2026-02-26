import { FilterState } from '@/types/filter';
import { Track } from '@/types/track';
import { describe, expect, it } from 'vitest';
import {
  filterAndSortTracks,
  filterByAuthors,
  filterByGenres,
  filterBySearch,
  filterByYears,
  sortTracks,
} from './filterTracks';

const mockTracks: Track[] = [
  {
    _id: 1,
    name: 'Rock Song',
    author: 'Author 1',
    release_date: '2020-01-01',
    genre: ['Rock', 'Pop'],
    duration_in_seconds: 180,
    album: 'Album 1',
    logo: null,
    track_file: 'track1.mp3',
    stared_user: [],
  },
  {
    _id: 2,
    name: 'Jazz Tune',
    author: 'Author 2',
    release_date: '2021-01-01',
    genre: ['Jazz'],
    duration_in_seconds: 200,
    album: 'Album 2',
    logo: null,
    track_file: 'track2.mp3',
    stared_user: [],
  },
  {
    _id: 3,
    name: 'Pop Hit',
    author: 'Author 1',
    release_date: '2022-01-01',
    genre: ['Pop', 'Rock'],
    duration_in_seconds: 220,
    album: 'Album 3',
    logo: null,
    track_file: 'track3.mp3',
    stared_user: [],
  },
];

describe('Функция filterBySearch', () => {
  it('должна возвращать все треки при пустом запросе', () => {
    const result = filterBySearch(mockTracks, '');
    expect(result).toEqual(mockTracks);
  });

  it('должна возвращать все треки при запросе из пробелов', () => {
    const result = filterBySearch(mockTracks, '   ');
    expect(result).toEqual(mockTracks);
  });

  it('должна фильтровать треки по названию (регистронезависимо)', () => {
    const result = filterBySearch(mockTracks, 'rock');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Rock Song');
  });

  it('должна фильтровать треки по частичному совпадению', () => {
    const result = filterBySearch(mockTracks, 'Jazz');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Jazz Tune');
  });

  it('должна возвращать пустой массив, если ничего не найдено', () => {
    const result = filterBySearch(mockTracks, 'NonExistent');
    expect(result).toHaveLength(0);
  });

  it('должна работать с пустым массивом треков', () => {
    const result = filterBySearch([], 'test');
    expect(result).toHaveLength(0);
  });
});

describe('Функция filterByAuthors', () => {
  it('должна возвращать все треки при пустом массиве авторов', () => {
    const result = filterByAuthors(mockTracks, []);
    expect(result).toEqual(mockTracks);
  });

  it('должна фильтровать треки по одному автору', () => {
    const result = filterByAuthors(mockTracks, ['Author 1']);
    expect(result).toHaveLength(2);
    expect(result.every((track) => track.author === 'Author 1')).toBe(true);
  });

  it('должна фильтровать треки по нескольким авторам', () => {
    const result = filterByAuthors(mockTracks, ['Author 1', 'Author 2']);
    expect(result).toHaveLength(3);
  });

  it('должна возвращать пустой массив, если автор не найден', () => {
    const result = filterByAuthors(mockTracks, ['NonExistent Author']);
    expect(result).toHaveLength(0);
  });
});

describe('Функция filterByGenres', () => {
  it('должна возвращать все треки при пустом массиве жанров', () => {
    const result = filterByGenres(mockTracks, []);
    expect(result).toEqual(mockTracks);
  });

  it('должна фильтровать треки по одному жанру', () => {
    const result = filterByGenres(mockTracks, ['Rock']);
    expect(result).toHaveLength(2);
    expect(result.every((track) => track.genre.includes('Rock'))).toBe(true);
  });

  it('должна фильтровать треки по нескольким жанрам', () => {
    const result = filterByGenres(mockTracks, ['Rock', 'Jazz']);
    expect(result).toHaveLength(3);
  });

  it('должна возвращать пустой массив, если жанр не найден', () => {
    const result = filterByGenres(mockTracks, ['NonExistent Genre']);
    expect(result).toHaveLength(0);
  });
});

describe('Функция filterByYears', () => {
  it('должна возвращать все треки при пустом массиве годов', () => {
    const result = filterByYears(mockTracks, []);
    expect(result).toEqual(mockTracks);
  });

  it('должна фильтровать треки по одному году', () => {
    const result = filterByYears(mockTracks, ['2020']);
    expect(result).toHaveLength(1);
    expect(result[0].release_date).toContain('2020');
  });

  it('должна фильтровать треки по нескольким годам', () => {
    const result = filterByYears(mockTracks, ['2020', '2021']);
    expect(result).toHaveLength(2);
  });

  it('должна возвращать пустой массив, если год не найден', () => {
    const result = filterByYears(mockTracks, ['1999']);
    expect(result).toHaveLength(0);
  });
});

describe('Функция sortTracks', () => {
  it('должна возвращать треки без изменений при sortOrder = "default"', () => {
    const result = sortTracks(mockTracks, 'default');
    expect(result).toEqual(mockTracks);
  });

  it('должна сортировать треки от старых к новым (oldest)', () => {
    const result = sortTracks(mockTracks, 'oldest');
    expect(result[0].release_date).toBe('2020-01-01');
    expect(result[1].release_date).toBe('2021-01-01');
    expect(result[2].release_date).toBe('2022-01-01');
  });

  it('должна сортировать треки от новых к старым (newest)', () => {
    const result = sortTracks(mockTracks, 'newest');
    expect(result[0].release_date).toBe('2022-01-01');
    expect(result[1].release_date).toBe('2021-01-01');
    expect(result[2].release_date).toBe('2020-01-01');
  });

  it('не должна изменять исходный массив', () => {
    const original = [...mockTracks];
    sortTracks(mockTracks, 'oldest');
    expect(mockTracks).toEqual(original);
  });
});

describe('Функция filterAndSortTracks', () => {
  it('должна возвращать все треки без фильтров', () => {
    const filterState: FilterState = {
      selectedAuthors: [],
      selectedGenres: [],
      selectedYears: [],
      sortOrder: 'default',
    };
    const result = filterAndSortTracks(mockTracks, filterState, '');
    expect(result).toEqual(mockTracks);
  });

  it('должна применять поиск и фильтры одновременно', () => {
    const filterState: FilterState = {
      selectedAuthors: ['Author 1'],
      selectedGenres: [],
      selectedYears: [],
      sortOrder: 'default',
    };
    const result = filterAndSortTracks(mockTracks, filterState, 'Rock');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Rock Song');
  });

  it('должна применять все фильтры и сортировку', () => {
    const filterState: FilterState = {
      selectedAuthors: ['Author 1'],
      selectedGenres: ['Rock'],
      selectedYears: ['2020', '2022'],
      sortOrder: 'newest',
    };
    const result = filterAndSortTracks(mockTracks, filterState, '');
    expect(result).toHaveLength(2);
    expect(result[0].release_date).toBe('2022-01-01');
    expect(result[1].release_date).toBe('2020-01-01');
  });

  it('должна работать с пустым массивом треков', () => {
    const filterState: FilterState = {
      selectedAuthors: [],
      selectedGenres: [],
      selectedYears: [],
      sortOrder: 'default',
    };
    const result = filterAndSortTracks([], filterState, '');
    expect(result).toHaveLength(0);
  });

  it('должна возвращать пустой массив, если фильтры не совпадают', () => {
    const filterState: FilterState = {
      selectedAuthors: ['NonExistent'],
      selectedGenres: [],
      selectedYears: [],
      sortOrder: 'default',
    };
    const result = filterAndSortTracks(mockTracks, filterState, '');
    expect(result).toHaveLength(0);
  });
});
