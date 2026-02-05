'use client';

import Image from 'next/image';
import Link from 'next/link';
import styles from './Sidebar.module.css';

export const Sidebar = () => {
  return (
    <div className={styles.main__sidebar}>
      <div className={styles.sidebar__personal}>
        <p className={styles.sidebar__personalName}>Sergey.Ivanov</p>
        <div className={styles.sidebar__icon}>
          <svg>
            <use xlinkHref="/img/icon/sprite.svg#logout"></use>
          </svg>
        </div>
      </div>

      <div className={styles.sidebar__block}>
        <div className={styles.sidebar__list}>
          <div className={styles.sidebar__item}>
            <Link href="#" className={styles.sidebar__link}>
              <Image
                src="/img/playlist01.png"
                alt="day's playlist"
                width={250}
                height={150}
                className={styles.sidebar__img}
                priority
              />
            </Link>
          </div>
          <div className={styles.sidebar__item}>
            <Link href="#" className={styles.sidebar__link}>
              <Image
                src="/img/playlist02.png"
                alt="day's playlist"
                width={250}
                height={150}
                className={styles.sidebar__img}
              />
            </Link>
          </div>
          <div className={styles.sidebar__item}>
            <Link href="#" className={styles.sidebar__link}>
              <Image
                src="/img/playlist03.png"
                alt="day's playlist"
                width={250}
                height={150}
                className={styles.sidebar__img}
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
