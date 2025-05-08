import React from 'react';

const PaginationControls = ({ loadPrevPage, loadNextPage, isFirstPage, hasMore }) => {
  return (
    <div className="flex justify-center items-center mt-6">
      <button
        onClick={loadPrevPage}
        disabled={isFirstPage}
        className={`inline-flex items-center px-4 py-2 border rounded-md text-sm font-medium ${
          isFirstPage
            ? 'border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed'
            : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
        }`}
      >
        <svg
          className="-ml-1 mr-2 h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
        Previous
      </button>
      
      <button
        onClick={loadNextPage}
        disabled={!hasMore}
        className={`inline-flex items-center px-4 py-2 border rounded-md text-sm font-medium ${
          !hasMore
            ? 'border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed'
            : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
        }`}
      >
        Load More
        <svg
          className="ml-2 -mr-1 h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
};

export default PaginationControls;