import { Track } from '@/types/track';

// Типы для подборок

export interface SelectionFromApi {
  _id: number;
  name: string;
  items: number[]; // ID треков
  owner: number[];
  __v?: number;
}

export interface Selection {
  _id: number;
  name: string;
  items: Track[]; // Полные объекты треков
  owner: number[];
  __v?: number;
}

export interface SelectionResponse {
  success: boolean;
  data: SelectionFromApi;
}

export interface SelectionsListResponse {
  success: boolean;
  data: SelectionFromApi[];
}
