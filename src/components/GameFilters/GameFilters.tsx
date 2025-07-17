import React from 'react';
import SearchInput from './SearchInput';
import TypeFilter from './TypeFilter';

interface GameFiltersProps {
  searchTerm: string;
  gameTypeFilter: string;
  gameTypes: string[];
  onSearchChange: (value: string) => void;
  onTypeFilterChange: (value: string) => void;
}

const GameFilters: React.FC<GameFiltersProps> = ({
  searchTerm,
  gameTypeFilter,
  gameTypes,
  onSearchChange,
  onTypeFilterChange,
}) => {
  return (
    <div className="filters-container">
      <TypeFilter value={gameTypeFilter} options={gameTypes} onChange={onTypeFilterChange} />
      <SearchInput value={searchTerm} onChange={onSearchChange} />
    </div>
  );
};

export default GameFilters;
