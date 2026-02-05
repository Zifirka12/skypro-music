'use client';

import { setIsPlaying, togglePlayPause } from '@/store/features/trackSlice';
import { useAppDispatch, useAppSelector } from '@/store/store';
import cn from 'classnames';
import { useEffect, useRef } from 'react';
import styles from './Bar.module.css';

export const Bar = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const dispatch = useAppDispatch();
  const currentTrack = useAppSelector((state) => state.tracks.currentTrack);
  const isPlaying = useAppSelector((state) => state.tracks.isPlaying);

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
  }, [isPlaying, dispatch]);

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

    const handleLoadStart = () => {
      // Трек начал загружаться
    };

    const handleLoadedData = () => {
      if (isPlaying) {
        audio.play().catch((error) => {
          console.error('Ошибка воспроизведения:', error);
          dispatch(setIsPlaying(false));
        });
      }
    };

    // Добавляем обработчики
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('loadeddata', handleLoadedData);

    // Загружаем новый трек только если это действительно новый трек
    if (audio.src !== currentTrack.track_file) {
      audio.src = currentTrack.track_file;
      audio.load();
    }

    // Очищаем обработчики при размонтировании
    return () => {
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('loadeddata', handleLoadedData);
    };
  }, [currentTrack, dispatch]);

  const handlePlayPause = () => {
    if (currentTrack) {
      dispatch(togglePlayPause());
    }
  };

  const handleNotImplemented = () => {
    alert('Еще не реализовано');
  };

  return (
    <div className={styles.bar}>
      <div className={styles.bar__content}>
        <div className={styles.bar__playerProgress}></div>
        <div className={styles.bar__playerBlock}>
          <div className={styles.bar__player}>
            <div className={styles.player__controls}>
              <div
                className={styles.player__btnPrev}
                onClick={handleNotImplemented}
              >
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
              <div
                className={styles.player__btnNext}
                onClick={handleNotImplemented}
              >
                <svg className={styles.player__btnNextSvg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-next"></use>
                </svg>
              </div>
              <div
                className={cn(styles.player__btnRepeat, styles.btnIcon)}
                onClick={handleNotImplemented}
              >
                <svg className={styles.player__btnRepeatSvg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-repeat"></use>
                </svg>
              </div>
              <div
                className={cn(styles.player__btnShuffle, styles.btnIcon)}
                onClick={handleNotImplemented}
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
                  className={cn(styles.player__btnShuffle, styles.btnIcon)}
                  onClick={handleNotImplemented}
                >
                  <svg className={styles.trackPlay__likeSvg}>
                    <use xlinkHref="/img/icon/sprite.svg#icon-like"></use>
                  </svg>
                </div>
                <div
                  className={cn(styles.trackPlay__dislike, styles.btnIcon)}
                  onClick={handleNotImplemented}
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
