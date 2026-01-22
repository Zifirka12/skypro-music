import { Track as TrackType } from '@/components/sharedTypes/track';
import { formatTime } from '@/utils/time';
import Link from 'next/link';
import styles from './Track.module.css';

interface TrackProps {
  track?: TrackType;
  isHeader?: boolean;
}

export const Track = ({ track, isHeader = false }: TrackProps) => {
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
    <div className={styles.playlist__item}>
      <div className={styles.playlist__track}>
        <div className={styles.track__title}>
          <div className={styles.track__titleImage}>
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
          <svg className={styles.track__timeSvg}>
            <use xlinkHref="/img/icon/sprite.svg#icon-like"></use>
          </svg>
          <span className={styles.track__timeText}>
            {formatTime(track!.duration_in_seconds)}
          </span>
        </div>
      </div>
    </div>
  );
};
