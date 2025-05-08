import React from 'react';

const SearchBar = ({ searchTerm, handleSearchTermChange, handleSearch, clearSearch, isSearching }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch();
  };

  return (
    <div className="w-full max-w-lg ">
      <form onSubmit={handleSubmit} className="flex rounded-md shadow-sm">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchTermChange}
          className="focus:ring-blue-500 p-3 focus:border-blue-500 flex-1 block w-full rounded-l-md sm:text-sm border-gray-300"
          placeholder="Search by name or email"
        />
        <button
          type="submit"
          className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-r-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
        
        {isSearching && (
          <button
            type="button"
            onClick={clearSearch}
            className="ml-2 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Clear
          </button>
        )}
      </form>
    </div>
  );
};

export default SearchBar;