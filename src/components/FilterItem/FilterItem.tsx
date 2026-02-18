import cn from 'classnames';
import styles from './FilterItem.module.css';

interface FilterItemProps {
  label: string;
  filterType: string;
  isActive: boolean;
  count?: number;
  onFilterClick: (filterType: string) => void;
  children?: React.ReactNode;
}

export const FilterItem = ({
  label,
  filterType,
  isActive,
  count = 0,
  onFilterClick,
  children,
}: FilterItemProps) => {
  return (
    <div className={styles.filter__buttonContainer}>
      <div
        className={cn(styles.filter__button, {
          [styles.active]: isActive || count > 0,
        })}
        onClick={() => onFilterClick(filterType)}
      >
        {label}
        {count > 0 && <span className={styles.filter__count}>{count}</span>}
      </div>
      {isActive && children}
    </div>
  );
};
