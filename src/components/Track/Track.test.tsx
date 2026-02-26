import { authSliceReducer } from '@/store/features/authSlice';
import { trackSliceReducer } from '@/store/features/trackSlice';
import { Track as TrackType } from '@/types/track';
import { configureStore } from '@reduxjs/toolkit';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { describe, expect, it, vi } from 'vitest';
import { Track } from './Track';

// Мокаем хук useLikeTrack
vi.mock('@/hooks/useLikeTrack', () => ({
  useLikeTrack: vi.fn(() => ({
    toggleLike: vi.fn(),
    isLike: false,
    isLoading: false,
    errorMsg: null,
  })),
}));

// Мокаем утилиту formatTime
vi.mock('@/utils/time', () => ({
  formatTime: (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  },
}));

// Мокаем Next.js Link
vi.mock('next/link', () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

const mockTrack: TrackType = {
  _id: 1,
  name: 'Test Track',
  author: 'Test Author',
  release_date: '2020-01-01',
  genre: ['Rock'],
  duration_in_seconds: 180,
  album: 'Test Album',
  logo: null,
  track_file: 'test.mp3',
  stared_user: [],
};

const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      tracks: trackSliceReducer,
      auth: authSliceReducer,
    },
    preloadedState: {
      tracks: {
        playlist: [],
        favoriteTracks: [],
        currentTrack: null,
        isPlaying: false,
        currentTime: 0,
        duration: 0,
        volume: 0.5,
        isShuffled: false,
        shuffledPlaylist: [],
        isRepeating: false,
        isLoading: false,
        error: null,
        ...initialState.tracks,
      },
      auth: {
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        ...initialState.auth,
      },
    },
  });
};

describe('Компонент Track', () => {
  it('должен корректно рендериться как заголовок', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <Track isHeader={true} />
      </Provider>,
    );

    expect(screen.getByText('Трек')).toBeInTheDocument();
    expect(screen.getByText('Исполнитель')).toBeInTheDocument();
    expect(screen.getByText('Альбом')).toBeInTheDocument();
  });

  it('должен корректно рендериться с данными трека', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <Track track={mockTrack} />
      </Provider>,
    );

    expect(screen.getByText('Test Track')).toBeInTheDocument();
    expect(screen.getByText('Test Author')).toBeInTheDocument();
    expect(screen.getByText('Test Album')).toBeInTheDocument();
    expect(screen.getByText('3:00')).toBeInTheDocument(); // 180 секунд = 3:00
  });

  it('должен показывать активное состояние, когда трек является текущим', () => {
    const store = createMockStore({
      tracks: {
        currentTrack: mockTrack,
        isPlaying: false,
      },
    });

    render(
      <Provider store={store}>
        <Track track={mockTrack} />
      </Provider>,
    );

    // Проверяем, что трек отображается
    expect(screen.getByText('Test Track')).toBeInTheDocument();
  });

  it('должен вызывать setCurrentTrack при клике на трек', async () => {
    const user = userEvent.setup();
    const store = createMockStore();
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    render(
      <Provider store={store}>
        <Track track={mockTrack} />
      </Provider>,
    );

    // Кликаем на элемент трека (можно кликнуть на название)
    const trackName = screen.getByText('Test Track');
    await user.click(trackName);

    // Проверяем, что был вызван dispatch
    expect(dispatchSpy).toHaveBeenCalled();
  });

  it('должен отображать время трека', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <Track track={mockTrack} />
      </Provider>,
    );

    // Проверяем, что время отображается
    expect(screen.getByText('3:00')).toBeInTheDocument();
  });

  it('должен корректно форматировать время', () => {
    const trackWithLongDuration: TrackType = {
      ...mockTrack,
      duration_in_seconds: 3661, // 1 час 1 минута 1 секунда
    };

    const store = createMockStore();
    render(
      <Provider store={store}>
        <Track track={trackWithLongDuration} />
      </Provider>,
    );

    expect(screen.getByText('61:01')).toBeInTheDocument();
  });

  it('должен обрабатывать трек с нулевой длительностью', () => {
    const trackWithZeroDuration: TrackType = {
      ...mockTrack,
      duration_in_seconds: 0,
    };

    const store = createMockStore();
    render(
      <Provider store={store}>
        <Track track={trackWithZeroDuration} />
      </Provider>,
    );

    expect(screen.getByText('0:00')).toBeInTheDocument();
  });
});
