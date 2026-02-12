import { Track } from '@/components/sharedTypes/track';

const API_BASE_URL = 'https://webdev-music-003b5b991590.herokuapp.com';

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

// Получение всех треков
export async function getAllTracks(): Promise<Track[]> {
  const response = await fetch(`${API_BASE_URL}/catalog/track/all/`, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error(`Ошибка загрузки треков: ${response.status}`);
  }

  const json: ApiResponse<Track[]> = await response.json();
  return json.data;
}

// Получение трека по ID
export async function getTrackById(id: number): Promise<Track> {
  const response = await fetch(`${API_BASE_URL}/catalog/track/${id}/`, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error(`Ошибка загрузки трека: ${response.status}`);
  }

  const json: ApiResponse<Track> = await response.json();
  return json.data;
}

// Получение избранных треков (требует авторизацию)
export async function getFavoriteTracks(accessToken: string): Promise<Track[]> {
  const response = await fetch(`${API_BASE_URL}/catalog/track/favorite/all/`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Ошибка загрузки избранных треков: ${response.status}`);
  }

  const json: ApiResponse<Track[]> = await response.json();
  return json.data;
}

// Добавление трека в избранное (требует авторизацию)
export async function addTrackToFavorite(
  id: number,
  accessToken: string,
): Promise<Track> {
  const response = await fetch(
    `${API_BASE_URL}/catalog/track/${id}/favorite/`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Ошибка добавления в избранное: ${response.status}`);
  }

  const json: ApiResponse<Track> = await response.json();
  return json.data;
}

// Удаление трека из избранного (требует авторизацию)
export async function removeTrackFromFavorite(
  id: number,
  accessToken: string,
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/catalog/track/${id}/favorite/`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Ошибка удаления из избранного: ${response.status}`);
  }
}
