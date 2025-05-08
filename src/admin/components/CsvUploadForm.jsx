import React from 'react';

const CsvUploadForm = ({ handleFileChange, handleCsvUpload, csvFile, uploadStatus, isUploading }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow w-full">
      <h3 className="text-sm font-medium text-gray-900 mb-2">Bulk Upload Participants</h3>
      <div className="mt-2">
        <div className="flex items-center space-x-2">
          <input
            id="csv-file"
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-medium
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
            disabled={isUploading}
          />
          <button
            onClick={handleCsvUpload}
            disabled={!csvFile || isUploading}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isUploading ? 'Uploading...' : 'Upload CSV'}
          </button>
        </div>
        {uploadStatus && (
          <p className={`mt-2 text-sm ${
            uploadStatus.includes('Error') ? 'text-red-600' : 
            uploadStatus.includes('complete') ? 'text-green-600' : 'text-blue-600'
          }`}>
            {uploadStatus}
          </p>
        )}
      </div>
    </div>
  );
};

export default CsvUploadForm;