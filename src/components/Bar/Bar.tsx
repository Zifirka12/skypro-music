'use client';

import {
  playNextTrack,
  playPrevTrack,
  setCurrentTime,
  setDuration,
  setIsPlaying,
  setVolume,
  togglePlayPause,
  toggleRepeat,
  toggleShuffle,
} from '@/store/features/trackSlice';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { useLikeTrack } from '@/hooks/useLikeTrack';
import cn from 'classnames';
import { useEffect, useRef, useCallback } from 'react';
import styles from './Bar.module.css';

// Функция для форматирования времени в формат MM:SS
const formatTime = (seconds: number): string => {
  if (isNaN(seconds) || seconds < 0) return '0:00';

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const Bar = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const dispatch = useAppDispatch();
  const currentTrack = useAppSelector((state) => state.tracks.currentTrack);
  const isPlaying = useAppSelector((state) => state.tracks.isPlaying);
  const isShuffled = useAppSelector((state) => state.tracks.isShuffled);
  const isRepeating = useAppSelector((state) => state.tracks.isRepeating);
  const volume = useAppSelector((state) => state.tracks.volume);
  const currentTime = useAppSelector((state) => state.tracks.currentTime);
  const duration = useAppSelector((state) => state.tracks.duration);

  const { toggleLike, isLike, isLoading } = useLikeTrack(currentTrack);

  // Управление громкостью
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
  }, [volume]);

  // Обрабатываем только play/pause для текущего трека
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    if (isPlaying) {
      // Проверяем, что аудио готово к воспроизведению
      if (audio.readyState >= 2) {
        audio.play().catch((error) => {
          console.error('Ошибка воспроизведения:', error);
          dispatch(setIsPlaying(false));
        });
      }
    } else {
      audio.pause();
    }
  }, [isPlaying, dispatch, currentTrack]);

  // Загружаем новый трек только когда меняется currentTrack
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    const handleCanPlay = () => {
      if (isPlaying) {
        audio.play().catch((error) => {
          console.error('Ошибка воспроизведения:', error);
          dispatch(setIsPlaying(false));
        });
      }
    };

    const handleError = (e: Event) => {
      console.error('Ошибка загрузки аудио для трека:', currentTrack.name);
      dispatch(setIsPlaying(false));
    };

    const handleTimeUpdate = () => {
      dispatch(setCurrentTime(audio.currentTime));
    };

    const handleLoadedMetadata = () => {
      dispatch(setDuration(audio.duration));
    };

    // Добавляем обработчики
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);

    // Загружаем новый трек
    audio.src = currentTrack.track_file;
    audio.load();

    // Очищаем обработчики при размонтировании
    return () => {
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [currentTrack, dispatch, isPlaying]);

  // Отдельный useEffect для обработки события ended
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    const handleEnded = () => {
      // Если включен режим повтора, начинаем трек заново
      if (isRepeating) {
        audio.currentTime = 0;
        audio.play().catch((error) => {
          console.error('Ошибка воспроизведения:', error);
        });
      } else {
        // Автоматически переключаемся на следующий трек
        dispatch(playNextTrack());
      }
    };

    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrack, dispatch, isRepeating]);

  // Мемоизируем все обработчики для предотвращения их пересоздания
  const handlePlayPause = useCallback(() => {
    if (currentTrack) {
      dispatch(togglePlayPause());
    }
  }, [currentTrack, dispatch]);

  const handlePrevTrack = useCallback(() => {
    dispatch(playPrevTrack());
  }, [dispatch]);

  const handleNextTrack = useCallback(() => {
    dispatch(playNextTrack());
  }, [dispatch]);

  const handleShuffle = useCallback(() => {
    dispatch(toggleShuffle());
  }, [dispatch]);

  const handleRepeat = useCallback(() => {
    dispatch(toggleRepeat());
  }, [dispatch]);

  const handleVolumeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newVolume = parseFloat(e.target.value);
      dispatch(setVolume(newVolume));
    },
    [dispatch],
  );

  const handleProgressChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const audio = audioRef.current;
      if (!audio || !duration) return;

      const newTime = parseFloat(e.target.value);
      audio.currentTime = newTime;
      dispatch(setCurrentTime(newTime));
    },
    [duration, dispatch],
  );

  const handleLikeClick = useCallback(() => {
    toggleLike();
  }, [toggleLike]);

  const handleDislikeClick = useCallback(() => {
    alert('Функция дизлайка еще не реализована');
  }, []);

  return (
    <div className={styles.bar}>
      <div className={styles.bar__content}>
        <div className={styles.bar__playerProgress}>
          <div className={styles.progressContainer}>
            <input
              type="range"
              min="0"
              max={duration || 0}
              step="0.1"
              value={currentTime || 0}
              onChange={handleProgressChange}
              className={styles.progressBar}
              style={
                {
                  '--progress-percent': duration
                    ? `${(currentTime / duration) * 100}%`
                    : '0%',
                } as React.CSSProperties
              }
            />
          </div>
          <div className={styles.progressTime}>
            <span className={styles.progressTimeLeft}>
              {formatTime(currentTime)}
            </span>
            <span className={styles.progressTimeDivider}> / </span>
            <span className={styles.progressTimeRight}>
              {formatTime(duration)}
            </span>
          </div>
        </div>
        <div className={styles.bar__playerBlock}>
          <div className={styles.bar__player}>
            <div className={styles.player__controls}>
              <div className={styles.player__btnPrev} onClick={handlePrevTrack}>
                <svg className={styles.player__btnPrevSvg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-prev"></use>
                </svg>
              </div>
              <div
                className={cn(styles.player__btnPlay, styles.btn)}
                onClick={handlePlayPause}
              >
                <svg className={styles.player__btnPlaySvg}>
                  <use
                    xlinkHref={
                      isPlaying
                        ? '/img/icon/sprite.svg#icon-pause'
                        : '/img/icon/sprite.svg#icon-play'
                    }
                  ></use>
                </svg>
              </div>
              <div className={styles.player__btnNext} onClick={handleNextTrack}>
                <svg className={styles.player__btnNextSvg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-next"></use>
                </svg>
              </div>
              <div
                className={cn(styles.player__btnRepeat, styles.btnIcon, {
                  [styles.active]: isRepeating,
                })}
                onClick={handleRepeat}
              >
                <svg className={styles.player__btnRepeatSvg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-repeat"></use>
                </svg>
              </div>
              <div
                className={cn(styles.player__btnShuffle, styles.btnIcon, {
                  [styles.active]: isShuffled,
                })}
                onClick={handleShuffle}
              >
                <svg className={styles.player__btnShuffleSvg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-shuffle"></use>
                </svg>
              </div>
            </div>
            <div className={styles.player__trackPlay}>
              <div className={styles.trackPlay__contain}>
                <div className={styles.trackPlay__image}>
                  <svg className={styles.trackPlay__svg}>
                    <use xlinkHref="/img/icon/sprite.svg#icon-note"></use>
                  </svg>
                </div>
                <div className={styles.trackPlay__author}>
                  <a className={styles.trackPlay__authorLink} href="">
                    {currentTrack?.name || 'Ты та...'}
                  </a>
                </div>
                <div className={styles.trackPlay__album}>
                  <a className={styles.trackPlay__albumLink} href="">
                    {currentTrack?.author || 'Баста'}
                  </a>
                </div>
              </div>
              <div className={styles.trackPlay__dislike}>
                <div
                  className={cn(styles.trackPlay__likeBtn, styles.btnIcon, {
                    [styles.liked]: isLike,
                    [styles.loading]: isLoading,
                  })}
                  onClick={handleLikeClick}
                  title={isLike ? 'Удалить из избранного' : 'Добавить в избранное'}
                >
                  <svg className={styles.trackPlay__likeSvg}>
                    <use xlinkHref="/img/icon/sprite.svg#icon-like"></use>
                  </svg>
                </div>
                <div
                  className={cn(styles.trackPlay__dislikeBtn, styles.btnIcon)}
                  onClick={handleDislikeClick}
                >
                  <svg className={styles.trackPlay__dislikeSvg}>
                    <use xlinkHref="/img/icon/sprite.svg#icon-dislike"></use>
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.bar__volumeBlock}>
            <div className={styles.volume__content}>
              <div className={styles.volume__image}>
                <svg className={styles.volume__svg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-volume"></use>
                </svg>
              </div>
              <div className={cn(styles.volume__progress, styles.btn)}>
                <input
                  className={cn(styles.volume__progressLine, styles.btn)}
                  type="range"
                  name="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <audio ref={audioRef} />
    </div>
  );
};
