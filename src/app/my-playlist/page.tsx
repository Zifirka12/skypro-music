'use client';

import styles from '@/components/CenterBlock/CenterBlock.module.css';
import { MainLayout } from '@/components/MainLayout/MainLayout';
import { Track } from '@/components/Track/Track';
import { useAppSelector } from '@/store/store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function MyPlaylist() {
  const router = useRouter();
  const { favoriteTracks } = useAppSelector((state) => state.tracks);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  // Проверка авторизации - перенаправляем на главную, если не авторизован
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  // Если не авторизован, не показываем контент (идет редирект)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <MainLayout>
      <div className={styles.centerblock}>
        <h2 className={styles.centerblock__h2}>Мои треки</h2>

        {favoriteTracks.length === 0 ? (
          <div className={styles.centerblock__empty}>
            <p>У вас пока нет избранных треков</p>
            <p
              style={{ marginTop: '10px', color: '#696969', fontSize: '14px' }}
            >
              Добавьте треки в избранное, нажав на иконку сердечка
            </p>
          </div>
        ) : (
          <div className={styles.centerblock__content}>
            <div className={styles.content__playlist}>
              <Track isHeader={true} />
              {favoriteTracks.map((track) => (
                <Track key={track._id} track={track} />
              ))}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
