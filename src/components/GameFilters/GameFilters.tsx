import React from 'react';
import { SearchInput } from './SearchInput/SearchInput';
import { TypeFilter } from './TypeFilter/TypeFilter';
import styles from './GameFilters.module.scss';

interface GameFiltersProps {
  searchTerm: string;
  gameTypeFilter: string;
  gameTypes: string[];
  onSearchChange: (value: string) => void;
  onTypeFilterChange: (value: string) => void;
}

export const GameFilters = React.memo(
  ({
    searchTerm,
    gameTypeFilter,
    gameTypes,
    onSearchChange,
    onTypeFilterChange,
  }: GameFiltersProps) => (
    <section className={styles.container} aria-label="Game filters">
      <TypeFilter value={gameTypeFilter} options={gameTypes} onChange={onTypeFilterChange} />
      <SearchInput value={searchTerm} onSubmit={onSearchChange} />
    </section>
  ),
);

GameFilters.displayName = 'GameFilters';
