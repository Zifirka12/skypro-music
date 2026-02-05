import { Track } from '@/components/sharedTypes/track';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type InitialStateType = {
  currentTrack: Track | null;
  isPlaying: boolean;
};

const initialState: InitialStateType = {
  currentTrack: null,
  isPlaying: false,
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
  },
});

export const { setCurrentTrack, togglePlayPause, setIsPlaying } =
  trackSlice.actions;
export const trackSliceReducer = trackSlice.reducer;
