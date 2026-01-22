import { data } from '@/app/data';
import { Filter } from '../Filter/Filter';
import { Search } from '../Search/Search';
import { Track } from '../Track/Track';
import styles from './CenterBlock.module.css';

export const CenterBlock = () => {
  return (
    <div className={styles.centerblock}>
      <Search />
      <Filter />
      <h2 className={styles.centerblock__h2}>Треки</h2>
      <div className={styles.centerblock__content}>
        <div className={styles.content__playlist}>
          <Track isHeader={true} />
          {data.map((track) => (
            <Track key={track._id} track={track} />
          ))}
        </div>
      </div>
    </div>
  );
};
