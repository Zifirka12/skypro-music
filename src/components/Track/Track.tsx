'use client';

import { Track as TrackType } from '@/components/sharedTypes/track';
import { setCurrentTrack } from '@/store/features/trackSlice';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { formatTime } from '@/utils/time';
import { useLikeTrack } from '@/hooks/useLikeTrack';
import Link from 'next/link';
import cn from 'classnames';
import { memo, useCallback, useMemo } from 'react';
import styles from './Track.module.css';

interface TrackProps {
  track?: TrackType;
  isHeader?: boolean;
}

const TrackComponent = ({ track, isHeader = false }: TrackProps) => {
  const dispatch = useAppDispatch();
  const currentTrack = useAppSelector((state) => state.tracks.currentTrack);
  const isPlaying = useAppSelector((state) => state.tracks.isPlaying);
  
  // Мемоизируем проверку активности трека
  const isActive = useMemo(
    () => currentTrack?._id === track?._id,
    [currentTrack?._id, track?._id],
  );

  const { toggleLike, isLike, isLoading, errorMsg } = useLikeTrack(track || null);

  // Мемоизируем обработчик клика по треку
  const handleTrackClick = useCallback(() => {
    if (track) {
      dispatch(setCurrentTrack(track));
    }
  }, [track, dispatch]);

  // Мемоизируем обработчик клика по лайку
  const handleLikeClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation(); // Предотвращаем запуск трека при клике на лайк
      toggleLike();
    },
    [toggleLike],
  );

  if (isHeader) {
    return (
      <div className={styles.playlist__item}>
        <div className={styles.playlist__track}>
          <div className={styles.track__title}>
            <div className={styles['track__title-text']}>
              <span className={styles.track__titleHeader}>Трек</span>
            </div>
          </div>
          <div className={styles.track__author}>
            <span className={styles.track__authorHeader}>Исполнитель</span>
          </div>
          <div className={styles.track__album}>
            <span className={styles.track__albumHeader}>Альбом</span>
          </div>
          <div className={styles.track__time}>
            <svg className={styles.track__timeSvg}>
              <use xlinkHref="/img/icon/sprite.svg#icon-watch"></use>
            </svg>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${styles.playlist__item} ${isActive ? styles.active : ''}`}
      onClick={handleTrackClick}
    >
      <div className={styles.playlist__track}>
        <div className={styles.track__title}>
          <div className={styles.track__titleImage}>
            {isActive && (
              <div
                className={`${styles.track__playingDot} ${isPlaying ? styles.playing : ''}`}
              ></div>
            )}
            <svg className={styles.track__titleSvg}>
              <use xlinkHref="/img/icon/sprite.svg#icon-note"></use>
            </svg>
          </div>
          <div className={styles['track__title-text']}>
            <Link className={styles.track__titleLink} href="#">
              {track!.name}
              <span className={styles.track__titleSpan}></span>
            </Link>
          </div>
        </div>
        <div className={styles.track__author}>
          <Link className={styles.track__authorLink} href="#">
            {track!.author}
          </Link>
        </div>
        <div className={styles.track__album}>
          <Link className={styles.track__albumLink} href="#">
            {track!.album}
          </Link>
        </div>
        <div className={styles.track__time}>
          <div
            className={cn(styles.track__likeButton, {
              [styles.liked]: isLike,
              [styles.loading]: isLoading,
            })}
            onClick={handleLikeClick}
            title={
              errorMsg ||
              (isLike ? 'Удалить из избранного' : 'Добавить в избранное')
            }
          >
            <svg className={styles.track__timeSvg}>
              <use xlinkHref="/img/icon/sprite.svg#icon-like"></use>
            </svg>
          </div>
          <span className={styles.track__timeText}>
            {formatTime(track!.duration_in_seconds)}
          </span>
        </div>
      </div>
    </div>
  );
};

// Оборачиваем компонент в React.memo для предотвращения лишних рендеров
export const Track = memo(TrackComponent);
