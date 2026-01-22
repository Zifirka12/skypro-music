import cn from 'classnames';
import styles from './FilterItem.module.css';

interface FilterItemProps {
  label: string;
  filterType: string;
  isActive: boolean;
  onFilterClick: (filterType: string) => void;
  children?: React.ReactNode;
}

export const FilterItem = ({
  label,
  filterType,
  isActive,
  onFilterClick,
  children,
}: FilterItemProps) => {
  return (
    <div className={styles.filter__buttonContainer}>
      <div
        className={cn(styles.filter__button, {
          [styles.active]: isActive,
        })}
        onClick={() => onFilterClick(filterType)}
      >
        {label}
      </div>
      {isActive && children}
    </div>
  );
};
