'use client';

import { logout, restoreAuth } from '@/store/features/authSlice';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { getAllSelections } from '@/api/selectionsApi';
import { SelectionFromApi } from '@/types/selection';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './Sidebar.module.css';

export const Sidebar = () => {
  const [isClient, setIsClient] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [selections, setSelections] = useState<SelectionFromApi[]>([]);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    setIsClient(true);
    dispatch(restoreAuth());

    // Загружаем подборки
    const loadSelections = async () => {
      try {
        const data = await getAllSelections();
        // Фильтруем только непустые подборки с названиями
        const validSelections = data.filter(
          (selection) =>
            selection.name && selection.items && selection.items.length > 0,
        );
        // Сортируем по ID (2, 3, 4) для правильного порядка
        const sortedSelections = validSelections.sort((a, b) => a._id - b._id);
        setSelections(sortedSelections);
      } catch (err) {
        console.error('Ошибка загрузки подборок:', err);
      }
    };

    loadSelections();
  }, [dispatch]);

  const handleLogout = () => {
    setIsLoggingOut(true);
    dispatch(logout());
    router.push('/signin');
  };

  // Маппинг изображений к подборкам (первые 3)
  const playlistImages = [
    '/img/playlist01.png',
    '/img/playlist02.png',
    '/img/playlist03.png',
  ];

  return (
    <div className={styles.main__sidebar}>
      {!isLoggingOut && isClient && isAuthenticated && (
        <div className={styles.sidebar__personal}>
          <p className={styles.sidebar__personalName}>
            {user?.email || 'Пользователь'}
          </p>
          <div className={styles.sidebar__icon} onClick={handleLogout}>
            <svg>
              <use xlinkHref="/img/icon/sprite.svg#logout"></use>
            </svg>
          </div>
        </div>
      )}

      <div className={styles.sidebar__block}>
        <div className={styles.sidebar__list}>
          {selections.slice(0, 3).map((selection, index) => (
            <div key={selection._id} className={styles.sidebar__item}>
              <Link
                href={`/selection/${selection._id}`}
                className={styles.sidebar__link}
              >
                <Image
                  src={playlistImages[index]}
                  alt={selection.name || `Подборка ${index + 1}`}
                  width={250}
                  height={150}
                  className={styles.sidebar__img}
                  priority={index === 0}
                />
              </Link>
            </div>
          ))}

          {/* Если подборок еще нет, показываем placeholder'ы */}
          {selections.length === 0 &&
            playlistImages.map((image, index) => (
              <div
                key={`placeholder-${index}`}
                className={styles.sidebar__item}
              >
                <div className={styles.sidebar__link}>
                  <Image
                    src={image}
                    alt={`Плейлист ${index + 1}`}
                    width={250}
                    height={150}
                    className={styles.sidebar__img}
                    priority={index === 0}
                  />
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
