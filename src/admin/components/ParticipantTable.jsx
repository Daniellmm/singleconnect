import React from 'react';

const GENDER_COLORS = {
  Male:   'bg-blue-100 text-blue-800',
  Female: 'bg-pink-100 text-pink-800',
};

const AGE_COLORS = {
  '22-26': 'bg-purple-100 text-purple-700',
  '27-30': 'bg-indigo-100 text-indigo-700',
  '31-35': 'bg-teal-100 text-teal-700',
  '36+':   'bg-orange-100 text-orange-700',
};

const safe = (v) => (v && v !== 'N/A' ? v : '—');

const Badge = ({ value, colorMap, fallback = 'bg-gray-100 text-gray-600' }) => (
  <span className={`px-2 py-0.5 inline-flex text-xs font-semibold rounded-full ${colorMap?.[value] ?? fallback}`}>
    {value && value !== 'N/A' ? value : '—'}
  </span>
);

const ParticipantTable = ({
  responses,
  loading,
  error,
  currentPage,
  responsesPerPage,
  updateStatus,
}) => {
  if (loading) {
    return (
      <div className="mt-6 bg-white shadow rounded-lg p-6">
        <div className="animate-pulse space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 rounded w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error && !responses.length) {
    return (
      <div className="mt-6 bg-white shadow rounded-lg p-6 text-center text-red-500 text-sm">
        Failed to load participants. Please try again.
      </div>
    );
  }

  if (!responses || responses.length === 0) {
    return (
      <div className="mt-6 bg-white shadow rounded-lg p-6 text-center text-gray-400 text-sm">
        No participants found.
      </div>
    );
  }

  const offset = (currentPage - 1) * responsesPerPage;

  return (
    <div className="mt-6 bg-white shadow rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              {[
                '#',
                'Name',
                'Phone',
                'Email',
                'Age Group',
                'Gender',
                'Church / Org',
                'Heard From',
                'Colour',
                'Registered',
                'Status',
                'Action',
              ].map((col) => (
                <th
                  key={col}
                  className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-100">
            {responses.map((r, i) => {
              const d = r.data ?? {};
              return (
                <tr
                  key={r.id}
                  className={r.completed ? 'bg-green-50' : 'hover:bg-gray-50'}
                >
                  {/* # */}
                  <td className="px-3 py-3 text-gray-400 whitespace-nowrap">
                    {offset + i + 1}
                  </td>

                  {/* Name */}
                  <td className="px-3 py-3 font-medium text-gray-900 whitespace-nowrap">
                    {safe(d.name)}
                  </td>

                  {/* Phone */}
                  <td className="px-3 py-3 text-gray-600 whitespace-nowrap">
                    {safe(d.phone)}
                  </td>

                  {/* Email */}
                  <td className="px-3 py-3 text-gray-600 whitespace-nowrap">
                    {safe(d.email)}
                  </td>

                  {/* Age Group */}
                  <td className="px-3 py-3 whitespace-nowrap">
                    <Badge value={d.ageGroup} colorMap={AGE_COLORS} />
                  </td>

                  {/* Gender */}
                  <td className="px-3 py-3 whitespace-nowrap">
                    <Badge value={d.gender} colorMap={GENDER_COLORS} />
                  </td>

                  {/* Church / Org */}
                  <td className="px-3 py-3 text-gray-600 max-w-[160px] truncate">
                    {safe(d.organization)}
                  </td>

                  {/* Heard From */}
                  <td className="px-3 py-3 text-gray-500 max-w-[140px] truncate">
                    {safe(d.hearAbout)}
                  </td>

                  {/* Colour */}
                    <td className="px-3 py-3 text-gray-700 whitespace-nowrap">
                    {safe(d.colour)}
                    </td>

                  {/* Registered date */}
                  <td className="px-3 py-3 text-gray-500 whitespace-nowrap">
                    {r.timestamp
                      ? (() => {
                          try {
                            const d = new Date(r.timestamp);
                            return isNaN(d) ? '—' : d.toLocaleDateString('en-GB');
                          } catch { return '—'; }
                        })()
                      : '—'}
                  </td>

                  {/* Status badge */}
                  <td className="px-3 py-3 whitespace-nowrap">
                    {r.completed ? (
                      <span className="px-2 py-0.5 inline-flex text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        ✓ Checked In
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 inline-flex text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        Pending
                      </span>
                    )}
                  </td>

                  {/* Action */}
                  <td className="px-3 py-3 whitespace-nowrap">
                    <button
                      onClick={() => updateStatus(r.id, !r.completed)}
                      className={`px-3 py-1 rounded text-white text-xs font-medium transition-colors ${
                        r.completed
                          ? 'bg-yellow-500 hover:bg-yellow-600'
                          : 'bg-green-600 hover:bg-green-700'
                      }`}
                    >
                      {r.completed ? 'Undo Check-in' : 'Check In'}
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