import React from 'react';

const AddParticipantForm = ({ participant, setParticipant, handleSubmit, isSubmitting }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setParticipant(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="mt-6 bg-white shadow overflow-hidden rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Participant</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name *
            </label>
            <input
              type="text"
              name="name"
              id="name"
              required
              value={participant.name}
              onChange={handleChange}
              className="mt-1 focus:ring-blue-500 border-2 p-2 border-black/40 focus:border-blue-500 block w-full shadow-sm sm:text-sm  rounded-md"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email *
            </label>
            <input
              type="email"
              name="email"
              id="email"
              required
              value={participant.email}
              onChange={handleChange}
              className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-2 p-2 border-black/40 rounded-md"
            />
          </div>

          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
              Gender
            </label>
            <select
              name="gender"
              id="gender"
              value={participant.gender}
              onChange={handleChange}
              className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-2 p-2 border-black/40 rounded-md"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              id="phone"
              value={participant.phone}
              onChange={handleChange}
              className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-2 p-2 border-black/40 rounded-md"
            />
          </div>

          <div>
            <label htmlFor="organization" className="block text-sm font-medium text-gray-700">
              Organization
            </label>
            <input
              type="text"
              name="organization"
              id="organization"
              value={participant.organization}
              onChange={handleChange}
              className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-2 p-2 border-black/40 rounded-md"
            />
          </div>

          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700">
              City
            </label>
            <input
              type="text"
              name="city"
              id="city"
              value={participant.city}
              onChange={handleChange}
              className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-2 p-2 border-black/40 rounded-md"
            />
          </div>

          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700">
              State
            </label>
            <input
              type="text"
              name="state"
              id="state"
              value={participant.state}
              onChange={handleChange}
              className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-2 p-2 border-black/40 rounded-md"
            />
          </div>

          <div>
            <label htmlFor="referral" className="block text-sm font-medium text-gray-700">
              Referral Source
            </label>
            <input
              type="text"
              name="referral"
              id="referral"
              value={participant.referral}
              onChange={handleChange}
              className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-2 p-2 border-black/40 rounded-md"
            />
          </div>
        </div>

        <div>
          <label htmlFor="expectation" className="block text-sm font-medium text-gray-700">
            Expectations
          </label>
          <textarea
            name="expectation"
            id="expectation"
            rows="3"
            value={participant.expectation}
            onChange={handleChange}
            className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-2 p-2 border-black/40 rounded-md"
          ></textarea>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Save Participant'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddParticipantForm;