'use client';

import { Bar } from '@/components/Bar/Bar';
import styles from '@/components/CenterBlock/CenterBlock.module.css';
import { Navigation } from '@/components/Navigation/Navigation';
import { Search } from '@/components/Search/Search';
import sidebarStyles from '@/components/Sidebar/Sidebar.module.css';
import { restoreAuth } from '@/store/features/authSlice';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { handleLogout } from '@/utils/logout';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

export default function NotFound() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const currentTrack = useAppSelector((state) => state.tracks.currentTrack);
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [searchQuery, setSearchQuery] = useState('');
  const [isClient, setIsClient] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    setIsClient(true);
    dispatch(restoreAuth());
  }, [dispatch]);

  const handleLogoutClick = useCallback(() => {
    setIsLoggingOut(true);
    handleLogout(dispatch, router);
  }, [dispatch, router]);

  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <div className="wrapper">
      <div className="container" style={{ position: 'relative' }}>
        <main className="main">
          <Navigation />
          <div className={styles.centerblock}>
            <div style={{ width: '1293px' }}>
              <Search value={searchQuery} onChange={setSearchQuery} />
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '50vh',
                textAlign: 'center',
                width: 'calc(100% + 151px)',
                paddingTop: '40px',
                marginLeft: '-226px',
                marginRight: '-40px',
              }}
            >
              <h1
                style={{
                  color: 'rgba(255, 255, 255, 1)',
                  fontFamily: 'StratosSkyeng',
                  fontSize: '160px',
                  fontWeight: 400,
                  lineHeight: '168px',
                  letterSpacing: '0px',
                  textAlign: 'left',
                  margin: '0 0 20px 0',
                }}
              >
                404
              </h1>
              <h2
                style={{
                  fontSize: '32px',
                  color: '#fff',
                  margin: '0 0 20px 0',
                }}
              >
                Страница не найдена 😭
              </h2>
              <p
                style={{
                  color: 'rgba(78, 78, 78, 1)',
                  fontFamily: 'StratosSkyeng',
                  fontSize: '18px',
                  fontWeight: 400,
                  lineHeight: '24px',
                  letterSpacing: '-0.3%',
                  textAlign: 'center',
                  margin: '0 0 40px 0',
                  maxWidth: '500px',
                }}
              >
                Возможно, она была удалена
                <br />
                или перенесена на другой адрес
              </p>
              <button
                onClick={handleGoHome}
                style={{
                  backgroundColor: '#B672FF',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '12px 24px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#9B59FF';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#B672FF';
                }}
              >
                Вернуться на главную
              </button>
            </div>
          </div>
          {!isLoggingOut && isAuthenticated && (
            <div
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                zIndex: 10,
              }}
            >
              <p className={sidebarStyles.sidebar__personalName}>
                {user?.email || 'Пользователь'}
              </p>
              <div
                className={sidebarStyles.sidebar__icon}
                onClick={handleLogoutClick}
              >
                <svg>
                  <use xlinkHref="/img/icon/sprite.svg#logout"></use>
                </svg>
              </div>
            </div>
          )}
        </main>
        {currentTrack && <Bar />}
      </div>
    </div>
  );
}
