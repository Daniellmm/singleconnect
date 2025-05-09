  import React from 'react';

  const ParticipantTable = ({ 
    responses, 
    loading, 
    error, 
    currentPage, 
    responsesPerPage, 
    updateStatus 
  }) => {
    // Helper function to safely get string values from potentially complex objects
    const safeValue = (value) => {
      if (value === null || value === undefined) {
        return "";
      }
      
      // If the value is an object with stringValue property (Firestore format)
      if (typeof value === 'object' && value !== null && 'stringValue' in value) {
        return value.stringValue;
      }
      
      // If it's another kind of object, convert to string
      if (typeof value === 'object' && value !== null) {
        return String(value);
      }
      
      return value;
    };

    if (loading) {
      return (
        <div className="mt-6 bg-white shadow overflow-hidden rounded-lg p-6 text-center">
          <div className="animate-pulse flex justify-center">
            <div className="h-4 w-1/4 bg-gray-200 rounded"></div>
          </div>
          <div className="mt-4 animate-pulse">
            <div className="h-4 w-full bg-gray-200 rounded mb-2.5"></div>
            <div className="h-4 w-full bg-gray-200 rounded mb-2.5"></div>
            <div className="h-4 w-full bg-gray-200 rounded mb-2.5"></div>
          </div>
        </div>
      );
    }

    if (error && !responses.length) {
      return (
        <div className="mt-6 bg-white shadow overflow-hidden rounded-lg p-6 text-center text-red-500">
          Failed to load participants. Please try again.
        </div>
      );
    }

    if (!responses || responses.length === 0) {
      return (
        <div className="mt-6 bg-white shadow overflow-hidden rounded-lg p-6 text-center text-gray-500">
          No participants found.
        </div>
      );
    }

    return (
      <div className="mt-6 bg-white shadow overflow-hidden rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Organization
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  City/State
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registration
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {responses.map((response) => {
                // Safely extract data with fallbacks
                const name = safeValue(response.data?.name);
                const email = safeValue(response.data?.email);
                const phone = safeValue(response.data?.phone);
                const organization = safeValue(response.data?.organization);
                const city = safeValue(response.data?.city);
                const state = safeValue(response.data?.state);

                return (
                  <tr key={response.id}>
                    <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {name}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                      {email}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                      {phone}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                      {organization}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                      {city}{city && state ? ', ' : ''}{state}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                      {response.timestamp ? (() => {
                        try {
                          const date = new Date(response.timestamp);
                          return !isNaN(date.getTime()) ? date.toLocaleDateString() : 'Invalid Date';
                        } catch (e) {
                          console.error("Error formatting date:", response.timestamp, e);
                          return 'Invalid Date';
                        }
                      })() : ''}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        response.completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {response.completed ? 'Completed' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => updateStatus(response.id, !response.completed)}
                        className={`px-3 py-1 rounded text-white text-xs ${
                          response.completed ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'
                        }`}
                      >
                        {response.completed ? 'Mark Pending' : 'Mark Complete'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  export default ParticipantTable;