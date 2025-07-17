import React from 'react';
import styles from './SearchInput.module.scss';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const SearchInput = React.memo(({ value, onChange }: SearchInputProps) => (
  <div className={styles.container}>
    <input
      type="text"
      placeholder="Q Search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={styles.input}
      aria-label="Search games"
    />
    <button className={styles.button} aria-label="Search">
      SEARCH
    </button>
  </div>
));

SearchInput.displayName = 'SearchInput';
