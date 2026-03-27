import { SelectionFromApi } from '@/types/selection';

const API_BASE_URL = 'https://webdev-music-003b5b991590.herokuapp.com';

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

// Получение всех подборок
export async function getAllSelections(): Promise<SelectionFromApi[]> {
  const response = await fetch(`${API_BASE_URL}/catalog/selection/all/`, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error(`Ошибка загрузки подборок: ${response.status}`);
  }

  const json: ApiResponse<SelectionFromApi[]> = await response.json();
  return json.data;
}

// Получение подборки по ID
export async function getSelectionById(id: number): Promise<SelectionFromApi> {
  const response = await fetch(`${API_BASE_URL}/catalog/selection/${id}/`, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error(`Ошибка загрузки подборки: ${response.status}`);
  }

  const json: ApiResponse<SelectionFromApi> = await response.json();
  return json.data;
}
