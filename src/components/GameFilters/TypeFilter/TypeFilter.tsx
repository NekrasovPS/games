import React from 'react';
import styles from './TypeFilter.module.scss';

interface TypeFilterProps {
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

export const TypeFilter = React.memo(({ value, options, onChange }: TypeFilterProps) => (
  <div className={styles.container}>
    <label htmlFor="game-type-filter" className={styles.label}>
      Game Type
    </label>
    <select
      id="game-type-filter"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={styles.select}
      aria-label="Filter by game type"
    >
      <option value="">All</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
));

TypeFilter.displayName = 'TypeFilter';
