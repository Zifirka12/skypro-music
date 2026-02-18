export type SortOrder = 'default' | 'oldest' | 'newest';

export interface FilterState {
  selectedAuthors: string[];
  selectedGenres: string[];
  selectedYears: string[];
  sortOrder: SortOrder;
}
