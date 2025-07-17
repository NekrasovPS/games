import React from 'react';

interface TypeFilterProps {
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

const TypeFilter: React.FC<TypeFilterProps> = ({ value, options, onChange }) => {
  return (
    <div className="filter-container">
      <label htmlFor="game-type-filter">Game Type</label>
      <select
        id="game-type-filter"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="type-filter"
      >
        <option value="">All</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TypeFilter;
