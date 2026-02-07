import { Track } from '@/components/sharedTypes/track';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type InitialStateType = {
  currentTrack: Track | null;
  isPlaying: boolean;
  playlist: Track[];
  isShuffled: boolean;
  shuffledPlaylist: Track[];
  isRepeating: boolean;
  volume: number;
  currentTime: number;
  duration: number;
};

const initialState: InitialStateType = {
  currentTrack: null,
  isPlaying: false,
  playlist: [],
  isShuffled: false,
  shuffledPlaylist: [],
  isRepeating: false,
  volume: 0.5, // Громкость по умолчанию 50%
  currentTime: 0,
  duration: 0,
};

// Функция для перемешивания массива (алгоритм Fisher-Yates)
const shuffleArray = (array: Track[]): Track[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const trackSlice = createSlice({
  name: 'tracks',
  initialState,
  reducers: {
    setCurrentTrack: (state, action: PayloadAction<Track>) => {
      state.currentTrack = action.payload;
      state.isPlaying = true;
    },
    togglePlayPause: (state) => {
      state.isPlaying = !state.isPlaying;
    },
    setIsPlaying: (state, action: PayloadAction<boolean>) => {
      state.isPlaying = action.payload;
    },
    setPlaylist: (state, action: PayloadAction<Track[]>) => {
      state.playlist = action.payload;
      // Если режим перемешивания включен, создаем перемешанный плейлист
      if (state.isShuffled) {
        state.shuffledPlaylist = shuffleArray(action.payload);
      }
    },
    toggleShuffle: (state) => {
      state.isShuffled = !state.isShuffled;

      if (state.isShuffled) {
        // Включаем перемешивание - создаем перемешанный плейлист
        state.shuffledPlaylist = shuffleArray(state.playlist);
      } else {
        // Выключаем перемешивание - очищаем перемешанный плейлист
        state.shuffledPlaylist = [];
      }
    },
    toggleRepeat: (state) => {
      state.isRepeating = !state.isRepeating;
    },
    setVolume: (state, action: PayloadAction<number>) => {
      state.volume = action.payload;
    },
    setCurrentTime: (state, action: PayloadAction<number>) => {
      state.currentTime = action.payload;
    },
    setDuration: (state, action: PayloadAction<number>) => {
      state.duration = action.payload;
    },
    playNextTrack: (state) => {
      if (state.playlist.length === 0) return;

      const currentPlaylist = state.isShuffled
        ? state.shuffledPlaylist
        : state.playlist;

      // Если нет текущего трека, начинаем с первого
      if (!state.currentTrack) {
        state.currentTrack = currentPlaylist[0];
        state.isPlaying = true;
        return;
      }

      const currentIndex = currentPlaylist.findIndex(
        (track) => track._id === state.currentTrack?._id,
      );

      // Если текущий трек найден и это не последний трек
      if (currentIndex !== -1 && currentIndex < currentPlaylist.length - 1) {
        state.currentTrack = currentPlaylist[currentIndex + 1];
        state.isPlaying = true;
      }
      // Если это последний трек - ничего не делаем
    },
    playPrevTrack: (state) => {
      if (state.playlist.length === 0) return;

      const currentPlaylist = state.isShuffled
        ? state.shuffledPlaylist
        : state.playlist;

      // Если нет текущего трека, начинаем с последнего
      if (!state.currentTrack) {
        state.currentTrack = currentPlaylist[currentPlaylist.length - 1];
        state.isPlaying = true;
        return;
      }

      const currentIndex = currentPlaylist.findIndex(
        (track) => track._id === state.currentTrack?._id,
      );

      // Если текущий трек найден и это не первый трек
      if (currentIndex > 0) {
        state.currentTrack = currentPlaylist[currentIndex - 1];
        state.isPlaying = true;
      }
      // Если это первый трек - ничего не делаем
    },
  },
});

export const {
  setCurrentTrack,
  togglePlayPause,
  setIsPlaying,
  setPlaylist,
  toggleShuffle,
  toggleRepeat,
  setVolume,
  setCurrentTime,
  setDuration,
  playNextTrack,
  playPrevTrack,
} = trackSlice.actions;
export const trackSliceReducer = trackSlice.reducer;
