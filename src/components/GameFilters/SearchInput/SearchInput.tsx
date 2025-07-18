import React, { useState } from 'react';
import styles from './SearchInput.module.scss';

interface SearchInputProps {
  value: string;
  onSubmit: (value: string) => void;
}

export const SearchInput = React.memo(({ value, onSubmit }: SearchInputProps) => {
  const [inputValue, setInputValue] = useState(value);

  const handleSearch = () => {
    onSubmit(inputValue.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.searchContainer}>
        <p>Search</p>
        <input
          type="text"
          placeholder="Search"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className={styles.input}
          aria-label="Search games"
        />
      </div>
      <button className={styles.button} onClick={handleSearch} aria-label="Search">
        SEARCH
      </button>
    </div>
  );
});

SearchInput.displayName = 'SearchInput';
