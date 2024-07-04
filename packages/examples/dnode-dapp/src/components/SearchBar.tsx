// components/SearchBar.tsx

import React, { useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'; // Import MagnifyingGlassIcon from Heroicons v2

interface SearchBarProps {
  onSearch: (searchTerm: string) => void; // Callback function to handle search
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    if (searchTerm.trim()) {
      onSearch(searchTerm);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="relative w-full max-w-lg mx-auto">
      {' '}
      {/* max-w-lg to reduce width */}
      <input
        type="text"
        placeholder="Search by Address"
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleKeyDown} // Use onKeyDown instead of onKeyPress
      />
      <button
        className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-2 rounded-md hover:bg-blue-600 focus:outline-none"
        onClick={handleSearch}
      >
        <MagnifyingGlassIcon className="h-5 w-5" />
      </button>
    </div>
  );
};

export default SearchBar;
