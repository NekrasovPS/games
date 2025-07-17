import React from 'react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ value, onChange }) => {
  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Q Search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="search-input"
      />
      <button className="search-button">SEARCH</button>
    </div>
  );
};

export default SearchInput;
