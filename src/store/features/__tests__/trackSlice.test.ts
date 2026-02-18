import { describe, expect, it, vi } from 'vitest';

import {
  addLikedTrack,
  playNextTrack,
  setCurrentTrack,
  setPlaylist,
  toggleShuffle,
  trackSliceReducer,
} from '../trackSlice';
import { Track } from '@/types/track';

const mockTracks: Track[] = [
  {
    _id: 1,
    name: 'First track',
    author: 'Artist 1',
    release_date: '2023-01-01',
    genre: ['pop'],
    duration_in_seconds: 210,
    album: 'Album 1',
    logo: null,
    track_file: '/track1.mp3',
    stared_user: [],
  },
  {
    _id: 2,
    name: 'Second track',
    author: 'Artist 2',
    release_date: '2023-01-02',
    genre: ['rock'],
    duration_in_seconds: 180,
    album: 'Album 2',
    logo: null,
    track_file: '/track2.mp3',
    stared_user: [],
  },
  {
    _id: 3,
    name: 'Third track',
    author: 'Artist 3',
    release_date: '2023-01-03',
    genre: ['electronic'],
    duration_in_seconds: 150,
    album: 'Album 3',
    logo: null,
    track_file: '/track3.mp3',
    stared_user: [],
  },
];

describe('trackSlice reducer', () => {
  it('sets playlist and shuffles tracks when shuffle is enabled', () => {
    let state = trackSliceReducer(undefined, toggleShuffle());
    // Deterministic shuffle for predictable results
    vi.spyOn(global.Math, 'random').mockReturnValue(0.5);

    state = trackSliceReducer(state, setPlaylist(mockTracks));

    expect(state.playlist).toHaveLength(mockTracks.length);
    expect(state.shuffledPlaylist).toHaveLength(mockTracks.length);
    expect(state.isShuffled).toBe(true);

    vi.restoreAllMocks();
  });

  it('moves to the next track within the current playlist', () => {
    let state = trackSliceReducer(undefined, setPlaylist(mockTracks));
    state = trackSliceReducer(state, setCurrentTrack(mockTracks[0]));

    state = trackSliceReducer(state, playNextTrack());

    expect(state.currentTrack?._id).toBe(mockTracks[1]._id);
    expect(state.isPlaying).toBe(true);
  });

  it('adds unique liked tracks only once', () => {
    let state = trackSliceReducer(undefined, setPlaylist(mockTracks));
    state = trackSliceReducer(state, addLikedTrack(mockTracks[0]));
    state = trackSliceReducer(state, addLikedTrack(mockTracks[0]));

    expect(state.favoriteTracks).toHaveLength(1);
    expect(state.favoriteTracks[0]._id).toBe(mockTracks[0]._id);
  });
});
