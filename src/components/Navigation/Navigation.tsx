'use client';

import { restoreAuth } from '@/store/features/authSlice';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { handleLogout } from '@/utils/logout';
import cn from 'classnames';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import styles from './Navigation.module.css';

export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  // Восстанавливаем авторизацию из localStorage после монтирования
  useEffect(() => {
    setIsClient(true);
    dispatch(restoreAuth());
  }, [dispatch]);

  // Мемоизируем обработчик переключения меню
  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  // Мемоизируем обработчик выхода
  const handleLogoutClick = useCallback(() => {
    setIsLoggingOut(true);
    handleLogout(dispatch, router);
  }, [dispatch, router]);

  return (
    <nav className={styles.main__nav}>
      <div className={styles.nav__logo}>
        <Image
          width={113}
          height={17}
          className={styles.logo__image}
          src="/img/logo.png"
          alt="logo"
        />
      </div>
      <div className={styles.nav__burger} onClick={toggleMenu}>
        <span className={styles.burger__line}></span>
        <span className={styles.burger__line}></span>
        <span className={styles.burger__line}></span>
      </div>
      <div
        className={cn(styles.nav__menu, {
          [styles.nav__menu_open]: isMenuOpen,
        })}
      >
        <ul className={styles.menu__list}>
          <li className={styles.menu__item}>
            <Link href="/" className={styles.menu__link}>
              Главное
            </Link>
          </li>
          {isClient && isAuthenticated && (
            <li className={styles.menu__item}>
              <Link href="/my-playlist" className={styles.menu__link}>
                Мой плейлист
              </Link>
            </li>
          )}
          {!isLoggingOut && isClient && isAuthenticated ? (
            <li className={styles.menu__item}>
              <button onClick={handleLogoutClick} className={styles.menu__link}>
                Выйти
              </button>
            </li>
          ) : (
            !isLoggingOut &&
            isClient && (
              <li className={styles.menu__item}>
                <Link href="/signin" className={styles.menu__link}>
                  Войти
                </Link>
              </li>
            )
          )}
        </ul>
      </div>
    </nav>
  );
};
