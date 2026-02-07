import { Track } from '@/components/sharedTypes/track';

/**
 * ТЕСТОВЫЕ ДАННЫЕ ДЛЯ ЛОКАЛЬНОЙ РАЗРАБОТКИ
 *
 * Этот файл содержит тестовые треки с доступными аудиофайлами.
 * Используется для локального тестирования функциональности плеера,
 * так как треки с herokuapp.com могут быть недоступны из-за геоблокировки.
 *
 * Как использовать:
 * 1. Откройте src/components/CenterBlock/CenterBlock.tsx
 * 2. Раскомментируйте строку: import { testData } from '@/app/testData';
 * 3. Замените все вхождения 'data' на 'testData'
 *
 * Для продакшена/проверки используйте оригинальные данные из data.ts
 */
export const testData: Track[] = [
  {
    _id: 1,
    name: 'Трек 1 - Колокольчик',
    author: 'Тестовый исполнитель 1',
    release_date: '2024-01-01',
    genre: ['Тест'],
    duration_in_seconds: 353, // ~5:53 минуты
    album: 'Тестовый альбом 1',
    logo: null,
    track_file: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    stared_user: [],
  },
  {
    _id: 2,
    name: 'Трек 2 - Другая мелодия',
    author: 'Тестовый исполнитель 2',
    release_date: '2024-01-01',
    genre: ['Тест'],
    duration_in_seconds: 320, // ~5:20 минуты
    album: 'Тестовый альбом 2',
    logo: null,
    track_file: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    stared_user: [],
  },
  {
    _id: 3,
    name: 'Трек 3 - Еще одна песня',
    author: 'Тестовый исполнитель 3',
    release_date: '2024-01-01',
    genre: ['Тест'],
    duration_in_seconds: 285, // ~4:45 минуты
    album: 'Тестовый альбом 3',
    logo: null,
    track_file: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    stared_user: [],
  },
  {
    _id: 4,
    name: 'Трек 4 - Четвертая композиция',
    author: 'Тестовый исполнитель 4',
    release_date: '2024-01-01',
    genre: ['Тест'],
    duration_in_seconds: 310, // ~5:10 минуты
    album: 'Тестовый альбом 4',
    logo: null,
    track_file: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    stared_user: [],
  },
  {
    _id: 5,
    name: 'Трек 5 - Пятая мелодия',
    author: 'Тестовый исполнитель 5',
    release_date: '2024-01-01',
    genre: ['Тест'],
    duration_in_seconds: 353, // ~5:53 минуты
    album: 'Тестовый альбом 5',
    logo: null,
    track_file: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    stared_user: [],
  },
];
